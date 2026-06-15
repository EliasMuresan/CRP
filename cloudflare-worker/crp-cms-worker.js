const DEFAULT_ADMIN_EMAIL = "crparad@gmail.com";
const ALLOWED_CONTENT_FILES = new Set(["content/site.json"]);
const PAGE_TEXT_PATTERN = /^content\/page-text\/[a-z0-9-]+\.json$/;
const MAX_ASSET_SIZE = 8 * 1024 * 1024;
const MAX_PAGE_TEXT_SIZE = 1024 * 1024;
const MAX_HTML_FILE_SIZE = 1024 * 1024;
const ASSET_PATH_PATTERN = /^images\/cms\/[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png|webp|gif)$/i;
const HTML_FILE_PATTERN = /^[a-z0-9][a-z0-9-]*\.html$/;
const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const RESERVED_HTML_FILES = new Set(["index.html", "evenimente-arhivate.html"]);

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

            if (!isAllowedContentPath(path)) {
                return json({ error: "Fisierul nu poate fi editat din editorul inline." }, 400, cors);
            }

            if (!body.content || typeof body.content !== "object" || Array.isArray(body.content)) {
                return json({ error: "Continut invalid." }, 400, cors);
            }
            validateContent(path, body.content);

            const assets = validateAssets(body.assets || []);
            const files = validateFiles(body.files || []);
            const result = await commitChangesToGitHub(env, path, body.content, assets, files);
            return json({
                ok: true,
                commit: result.commit,
                assets: result.assets,
                files: result.files
            }, 200, cors);
        } catch (error) {
            return json({ error: error.message || "Salvarea nu a reusit." }, 500, cors);
        }
    }
};

function isAllowedContentPath(path) {
    return ALLOWED_CONTENT_FILES.has(path) || PAGE_TEXT_PATTERN.test(path);
}

function validateContent(path, content) {
    if (!PAGE_TEXT_PATTERN.test(path)) return;

    if (typeof content.page !== "string" || !content.page.endsWith(".html")) {
        throw new Error("Pagina nu este valida.");
    }

    if (!content.texts || typeof content.texts !== "object" || Array.isArray(content.texts)) {
        throw new Error("Textele paginii nu sunt valide.");
    }

    const serialized = JSON.stringify(content);
    if (serialized.length > MAX_PAGE_TEXT_SIZE) {
        throw new Error("Pagina are prea mult text pentru o singura salvare.");
    }

    Object.entries(content.texts).forEach(([key, value]) => {
        if (!/^t\d{4}$/.test(key)) {
            throw new Error("Cheie text invalida.");
        }
        if (typeof value !== "string") {
            throw new Error("Text invalid.");
        }
        if (value.length > 20000) {
            throw new Error("Un text este prea lung.");
        }
    });
}

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

function validateFiles(files) {
    if (!Array.isArray(files)) throw new Error("Lista de fisiere este invalida.");
    if (files.length > 5) throw new Error("Prea multe fisiere intr-o singura salvare.");

    return files.map((file) => {
        const path = String(file.path || "");
        const contentBase64 = String(file.contentBase64 || "");
        const contentType = String(file.contentType || "").toLowerCase();

        if (!HTML_FILE_PATTERN.test(path) || RESERVED_HTML_FILES.has(path)) {
            throw new Error("Pagina noua trebuie sa fie un fisier HTML valid.");
        }

        if (contentType && !contentType.startsWith("text/html")) {
            throw new Error("Tipul paginii noi nu este acceptat.");
        }

        if (!contentBase64 || !/^[A-Za-z0-9+/=]+$/.test(contentBase64)) {
            throw new Error("Pagina noua nu a fost trimisa corect.");
        }

        const estimatedSize = Math.floor((contentBase64.length * 3) / 4);
        if (estimatedSize > MAX_HTML_FILE_SIZE) {
            throw new Error("Pagina noua este prea mare.");
        }

        return {
            path,
            contentBase64,
            contentType: contentType || "text/html; charset=utf-8",
            createOnly: file.createOnly !== false
        };
    });
}

async function commitChangesToGitHub(env, path, content, assets, extraFiles) {
    const files = assets.map((asset) => ({
        path: asset.path,
        contentBase64: asset.contentBase64
    }));
    extraFiles.forEach((file) => {
        files.push({
            path: file.path,
            contentBase64: file.contentBase64,
            createOnly: file.createOnly
        });
    });
    files.push({
        path,
        contentBase64: toBase64(`${JSON.stringify(content, null, 2)}\n`)
    });

    const details = [];
    if (assets.length) details.push("imagini");
    if (extraFiles.length) details.push("pagini noi");
    const message = details.length
        ? `cms: actualizeaza ${path} si ${details.join(", ")}`
        : `cms: actualizeaza ${path}`;
    const result = await commitFilesToGitHub(env, files, message);

    return {
        commit: result.commit,
        assets: assets.map((asset) => ({ path: asset.path })),
        files: extraFiles.map((file) => ({ path: file.path }))
    };
}

async function commitFilesToGitHub(env, files, message) {
    const owner = requiredEnv(env, "GITHUB_OWNER");
    const repo = requiredEnv(env, "GITHUB_REPO");
    const token = requiredEnv(env, "GITHUB_TOKEN");
    const branch = env.GITHUB_BRANCH || "main";
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "crp-inline-cms",
        "X-GitHub-Api-Version": "2022-11-28"
    };

    const api = `https://api.github.com/repos/${owner}/${repo}`;

    for (let attempt = 0; attempt < 2; attempt += 1) {
        const ref = await githubJson(`${api}/git/ref/heads/${encodeURIComponent(branch)}`, {
            headers
        });
        const parentSha = ref.object && ref.object.sha;
        if (!parentSha) throw new Error("Nu pot citi branch-ul GitHub.");

        const parentCommit = await githubJson(`${api}/git/commits/${parentSha}`, { headers });
        const baseTree = parentCommit.tree && parentCommit.tree.sha;
        if (!baseTree) throw new Error("Nu pot citi structura repo-ului.");

        const createOnlyPaths = files.filter((file) => file.createOnly).map((file) => file.path);
        if (createOnlyPaths.length) {
            const currentTree = await githubJson(`${api}/git/trees/${baseTree}?recursive=1`, { headers });
            const existingPaths = new Set((currentTree.tree || []).map((entry) => entry.path));
            const duplicatePath = createOnlyPaths.find((filePath) => existingPaths.has(filePath));
            if (duplicatePath) {
                throw new Error(`Fisierul ${duplicatePath} exista deja. Alege alt nume pentru eveniment.`);
            }
        }

        const tree = [];
        for (const file of files) {
            const blob = await githubJson(`${api}/git/blobs`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    content: file.contentBase64,
                    encoding: "base64"
                })
            });

            tree.push({
                path: file.path,
                mode: "100644",
                type: "blob",
                sha: blob.sha
            });
        }

        const newTree = await githubJson(`${api}/git/trees`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                base_tree: baseTree,
                tree
            })
        });

        const newCommit = await githubJson(`${api}/git/commits`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                message,
                tree: newTree.sha,
                parents: [parentSha]
            })
        });

        try {
            await githubJson(`${api}/git/refs/heads/${encodeURIComponent(branch)}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    sha: newCommit.sha,
                    force: false
                })
            });

            return { commit: newCommit };
        } catch (error) {
            if (attempt === 0 && /fast-forward|Reference update failed|not fast/i.test(error.message || "")) {
                continue;
            }
            throw error;
        }
    }

    throw new Error("Nu am putut actualiza branch-ul GitHub.");
}

async function githubJson(url, options) {
    const response = await fetch(url, options);
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
