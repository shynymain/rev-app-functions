export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ ok: false, error: "No file" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    const result = await env.AI.run(
      "@cf/meta/llama-3.2-11b-vision-instruct",
      {
        image: bytes,
        prompt: `
この画像は競馬の出馬表・オッズ画面です。
画像内の情報をJSON形式のみで出力してください。

説明は禁止。
必ずJSONのみ。

形式:
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

読めない場合は空文字。
`
      }
    );

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
