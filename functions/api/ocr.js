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
JSONのみで出力してください。説明は禁止。

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

    let text = ai.response || "";

    // ① ```削除
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // ② 改行除去
    text = text.replace(/\n/g, "").replace(/\r/g, "");

    // ③ 余計なバックスラッシュ整理
    text = text.replace(/\\"/g, '"');

    // ④ JSON部分だけ抜き出す（これが重要）
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return new Response(JSON.stringify({ ok: false, raw: text }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const jsonText = text.slice(start, end + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, raw: jsonText }), {
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
}    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

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
