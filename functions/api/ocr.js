export async function onRequestPost({ request, env }) {
  try {
    if (!env.AI) {
      return Response.json({ ok: false, error: "AI binding not found" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ ok: false, error: "画像ファイルがありません" }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    const ai = await env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", {
      image: bytes,
      temperature: 0,
      prompt: `
あなたは競馬画像専用OCRです。

絶対ルール：
・JSONのみ返す
・説明文禁止
・Pythonコード禁止
・Markdown禁止
・コードブロック禁止
・読めない項目は空文字

出力形式：
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
  ],
  "text": ""
}

画像内の競馬出馬表・オッズ・着順情報を読み取ってください。
`
    });

    let text = "";

    if (typeof ai === "string") {
      text = ai;
    } else if (ai.response) {
      text = ai.response;
    } else {
      text = JSON.stringify(ai);
    }

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return Response.json({
        ok: false,
        error: "JSON部分を抽出できません",
        raw: text
      });
    }

    const jsonText = text.slice(start, end + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      return Response.json({
        ok: false,
        error: "JSON.parse失敗",
        raw: jsonText
      });
    }

    return Response.json({
      ok: true,
      data: parsed
    });

  } catch (e) {
    return Response.json({
      ok: false,
      error: String(e.message || e)
    }, { status: 500 });
  }
}    const start = text.indexOf("{");
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
