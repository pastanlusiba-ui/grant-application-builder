import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = normalize(join(__dirname, ".."));
const port = Number(process.env.PORT || 8791);

function loadEnvFile() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });
}

loadEnvFile();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(text);
}

async function readRequestJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function handleGeminiGenerate(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendText(res, 500, "GEMINI_API_KEY is not configured on the backend.");
    return;
  }

  let body;
  try {
    body = await readRequestJson(req);
  } catch {
    sendText(res, 400, "Invalid JSON request.");
    return;
  }

  const model = body.model || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = String(body.prompt || "").trim();
  if (!prompt) {
    sendText(res, 400, "Prompt is required.");
    return;
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: body.expectJson ? { responseMimeType: "application/json" } : undefined,
    }),
  });

  const resultText = await response.text();
  if (!response.ok) {
    sendText(res, response.status, resultText.slice(0, 1000));
    return;
  }

  let result;
  try {
    result = JSON.parse(resultText);
  } catch {
    sendText(res, 502, "Gemini returned invalid JSON.");
    return;
  }

  const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim() || "";
  sendJson(res, 200, { text, model });
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = normalize(join(rootDir, requestedPath));

  if (!filePath.startsWith(rootDir)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    });
    res.end(content);
  } catch {
    sendText(res, 404, "Not found");
  }
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/ai/status") {
    sendJson(res, 200, {
      ready: Boolean(process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
    return;
  }

  if (req.method === "GET" && req.url === "/api/gemini/generate") {
    sendJson(res, 200, {
      message: "Gemini generation endpoint is ready. The app sends POST requests here; open /index.html to use the platform.",
      ready: Boolean(process.env.GEMINI_API_KEY),
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/gemini/generate") {
    try {
      await handleGeminiGenerate(req, res);
    } catch (error) {
      sendText(res, 500, error.message || "AI backend error.");
    }
    return;
  }

  if (req.method === "GET") {
    await serveStatic(req, res);
    return;
  }

  sendText(res, 405, "Method not allowed");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`GrantCraft backend running at http://127.0.0.1:${port}`);
});
