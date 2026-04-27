export async function onRequestPost({ request, env }) {
  try {
    return new Response(JSON.stringify({ ok: true, msg: "OCR ready" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
