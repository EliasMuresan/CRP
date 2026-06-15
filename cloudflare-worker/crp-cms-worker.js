const DEFAULT_ADMIN_EMAIL = "crparad@gmail.com";
const ALLOWED_CONTENT_FILES = new Set(["content/site.json"]);
const MAX_ASSET_SIZE = 8 * 1024 * 1024;
const ASSET_PATH_PATTERN = /^images\/cms\/[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png|webp|gif)$/i;
const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);

export default {
    async fetch(request, env) {
        const origin = request.headers.get("Origin") || "";
        const cors = corsHeaders(origin, env);

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: cors });
        }

        if (request.method !== "POST") {
            return json({ error: "Metoda nepermisa." }, 405, cors);
        }

        try {
            if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
                return json({ error: "Origine nepermisa." }, 403, cors);
            }

            const token = readBearerToken(request);
            const email = await verifyFirebaseUser(token, env);
            const adminEmail = String(env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();

            if (email.toLowerCase() !== adminEmail) {
                return json({ error: "Contul nu are acces de editare." }, 403, cors);
            }

            const body = await request.json();
            const path = String(body.path || "");

            if (!ALLOWED_CONTENT_FILES.has(path)) {
                return json({ error: "Fisierul nu poate fi editat din editorul inline." }, 400, cors);
            }

            if (!body.content || typeof body.content !== "object" || Array.isArray(body.content)) {
                return json({ error: "Continut invalid." }, 400, cors);
            }

            const assets = validateAssets(body.assets || []);
            const result = await commitChangesToGitHub(env, path, body.content, assets);
            return json({
                ok: true,
                commit: result.commit,
                assets: result.assets
            }, 200, cors);
        } catch (error) {
            return json({ error: error.message || "Salvarea nu a reusit." }, 500, cors);
        }
    }
};

function corsHeaders(origin, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || origin || "*";
    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Vary": "Origin"
    };
}

function json(payload, status, headers) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            ...headers,
            "Content-Type": "application/json; charset=utf-8"
        }
    });
}

function readBearerToken(request) {
    const header = request.headers.get("Authorization") || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) throw new Error("Lipseste sesiunea de admin.");
    return match[1];
}

async function verifyFirebaseUser(idToken, env) {
    if (!env.FIREBASE_API_KEY) throw new Error("Lipseste FIREBASE_API_KEY in Worker.");

    const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken })
        }
    );

    if (!response.ok) throw new Error("Sesiunea de admin nu mai este valida.");

    const data = await response.json();
    const user = data.users && data.users[0];
    if (!user || !user.email) throw new Error("Nu pot verifica utilizatorul.");
    return user.email;
}

function validateAssets(assets) {
    if (!Array.isArray(assets)) throw new Error("Lista de imagini este invalida.");
    if (assets.length > 20) throw new Error("Prea multe imagini intr-o singura salvare.");

    return assets.map((asset) => {
        const path = String(asset.path || "");
        const contentBase64 = String(asset.contentBase64 || "");
        const contentType = String(asset.contentType || "").toLowerCase();
        const originalName = String(asset.originalName || "");

        if (!ASSET_PATH_PATTERN.test(path)) {
            throw new Error("Imaginea trebuie salvata in folderul images/cms.");
        }

        if (!IMAGE_TYPES.has(contentType)) {
            throw new Error("Tipul imaginii nu este acceptat.");
        }

        if (!contentBase64 || !/^[A-Za-z0-9+/=]+$/.test(contentBase64)) {
            throw new Error("Imaginea nu a fost trimisa corect.");
        }

        const estimatedSize = Math.floor((contentBase64.length * 3) / 4);
        if (estimatedSize > MAX_ASSET_SIZE) {
            throw new Error("Imaginea este prea mare.");
        }

        return {
            path,
            contentBase64,
            contentType,
            originalName
        };
    });
}

async function commitChangesToGitHub(env, path, content, assets) {
    const committedAssets = [];

    for (const asset of assets) {
        const result = await commitFileToGitHub(
            env,
            asset.path,
            asset.contentBase64,
            `cms: adauga imagine ${asset.path}`
        );
        committedAssets.push({
            path: asset.path,
            commit: result.commit
        });
    }

    const contentResult = await commitFileToGitHub(
        env,
        path,
        toBase64(`${JSON.stringify(content, null, 2)}\n`),
        `cms: actualizeaza ${path}`
    );

    return {
        commit: contentResult.commit,
        assets: committedAssets
    };
}

async function commitFileToGitHub(env, path, contentBase64, message) {
    const owner = requiredEnv(env, "GITHUB_OWNER");
    const repo = requiredEnv(env, "GITHUB_REPO");
    const token = requiredEnv(env, "GITHUB_TOKEN");
    const branch = env.GITHUB_BRANCH || "main";
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "crp-inline-cms",
        "X-GitHub-Api-Version": "2022-11-28"
    };

    const current = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
    let currentSha = null;
    if (current.ok) {
        const currentFile = await current.json();
        currentSha = currentFile.sha || null;
    } else if (current.status !== 404) {
        throw new Error("Nu pot citi fisierul curent din GitHub.");
    }

    const payload = {
        branch,
        message,
        content: contentBase64
    };
    if (currentSha) payload.sha = currentSha;

    const response = await fetch(apiUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(result.message || "GitHub a refuzat salvarea.");
    }

    return result;
}

function requiredEnv(env, name) {
    if (!env[name]) throw new Error(`Lipseste ${name} in Worker.`);
    return env[name];
}

function toBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
        const chunk = bytes.subarray(index, index + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
    }

    return btoa(binary);
}
