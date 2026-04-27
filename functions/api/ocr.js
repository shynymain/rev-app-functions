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

    if (file.size > 4 * 1024 * 1024) {
      return json({
        ok: false,
        error: "画像が大きすぎます。スクショをトリミングするか、画像サイズを小さくしてください。",
        sizeMB: Math.round(file.size / 1024 / 1024 * 10) / 10
      }, 413);
    }

    const image = [...new Uint8Array(await file.arrayBuffer())];

  const prompt = "agree";
返答はJSONのみ。説明不要。

{
  "horses":[
    {"number":"","name":"","last1":"","last2":"","last3":"","odds":"","popularity":""}
  ],
  "text":""
}

不明は空文字。
`;

    const aiResult = await Promise.race([
      env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", {
        image,
        prompt
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("OCR timeout: 20秒以内に処理できませんでした。画像を小さくしてください。")), 20000)
      )
    ]);

    return json({
      ok: true,
      result: aiResult
    });

  } catch (e) {
    return json({
      ok: false,
      error: String(e.message || e)
    }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
