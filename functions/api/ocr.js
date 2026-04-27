export async function onRequestPost({ request, env }) {
  try {
    if (!env.AI) {
      return json({ ok: false, error: "AI binding not found" }, 500);
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!file) {
      return json({ ok: false, error: "画像ファイルがありません" }, 400);
    }

    const bytes = [...new Uint8Array(await file.arrayBuffer())];

    const prompt = `
添付画像から競馬の出馬表・単勝オッズ・結果を読み取ってください。
返答はJSONのみ。

形式:
{
  "text": "読み取った全文",
  "horses": [
    {
      "number": 1,
      "name": "馬名",
      "last1": "4",
      "last2": "8",
      "last3": "1",
      "odds": "2.0",
      "popularity": ""
    }
  ],
  "result": {
    "first": "",
    "second": "",
    "third": "",
    "umaren": "",
    "sanrenpuku": ""
  }
}
不明な値は空文字。
`;

    const response = await env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", {
      image: bytes,
      prompt
    });

    return json({
      ok: true,
      raw: response,
      text: typeof response === "string" ? response : JSON.stringify(response)
    });

  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
