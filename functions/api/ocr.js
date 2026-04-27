export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    const bytes = new Uint8Array(await file.arrayBuffer());

    const ai = await env.AI.run(
      "@cf/meta/llama-3.2-11b-vision-instruct",
      {
        image: bytes,
        prompt: `
この画像は競馬の出馬表です。
JSONのみで返してください。説明は禁止。

{
  "horses": [
    {
      "number": "",
      "name": "",
      "last1": "",
      "last2": "",
      "last3": "",
      "odds": "",
      "popularity": ""
    }
  ]
}
`
      }
    );

    // 👇ここが超重要
    let text = ai.response || "";

    // ```json を除去
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ ok: false, raw: text }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true, data: parsed }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
