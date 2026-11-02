// Supabase Edge Function "gemini": lets the family's devices use AI marking without
// each device holding a Gemini API key. The key lives only in this project's secrets.
//
// Secrets (Project Settings → Edge Functions → Secrets):
//   GEMINI_API_KEY  the Google AI Studio key
//   FAMILY_ROOMS    the leaderboard room codes allowed to use it, comma-separated
//
// Requests are accepted only from the site below and only with an allowed room code,
// and are passed straight through to Gemini so the site reads the same streamed reply.

const ORIGINS = ["https://rememberyou2.github.io"];
const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
const MAX_PROMPT = 60000;

function fail(status: number, code: string, message: string, cors: Record<string, string>) {
  return new Response(JSON.stringify({ error: { status: code, message } }), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const cors = {
    "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-family-room",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST" || !ORIGINS.includes(origin)) return fail(403, "FAMILY_ORIGIN", "This site is not allowed.", cors);

  const rooms = (Deno.env.get("FAMILY_ROOMS") ?? "").split(",").map((r) => r.trim()).filter(Boolean);
  if (!rooms.includes(req.headers.get("x-family-room") ?? "")) return fail(403, "FAMILY_ROOM", "This room code is not allowed.", cors);

  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return fail(500, "FAMILY_NO_KEY", "GEMINI_API_KEY is not set.", cors);

  let body: { prompt?: unknown; model?: unknown };
  try { body = await req.json(); } catch { return fail(400, "FAMILY_BAD_REQUEST", "Invalid JSON.", cors); }
  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  if (!prompt || prompt.length > MAX_PROMPT) return fail(400, "FAMILY_BAD_REQUEST", "Invalid prompt.", cors);
  const model = MODELS.includes(body.model as string) ? (body.model as string) : MODELS[0];

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      signal: req.signal,
    },
  );
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { ...cors, "content-type": upstream.headers.get("content-type") ?? "text/event-stream" },
  });
});
