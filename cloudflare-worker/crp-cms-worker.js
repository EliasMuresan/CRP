const DEFAULT_ADMIN_EMAIL = "crparad@gmail.com";
const ALLOWED_FILES = new Set(["content/site.json"]);

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

            if (!ALLOWED_FILES.has(path)) {
                return json({ error: "Fisierul nu poate fi editat din editorul inline." }, 400, cors);
            }

            if (!body.content || typeof body.content !== "object" || Array.isArray(body.content)) {
                return json({ error: "Continut invalid." }, 400, cors);
            }

            const result = await commitJsonToGitHub(env, path, body.content);
            return json({ ok: true, commit: result.commit }, 200, cors);
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

async function commitJsonToGitHub(env, path, content) {
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
    if (!current.ok) throw new Error("Nu pot citi fisierul curent din GitHub.");
    const currentFile = await current.json();

    const response = await fetch(apiUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify({
            branch,
            sha: currentFile.sha,
            message: `cms: actualizeaza ${path}`,
            content: toBase64(`${JSON.stringify(content, null, 2)}\n`)
        })
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
