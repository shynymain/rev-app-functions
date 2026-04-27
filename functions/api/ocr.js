export async function onRequestPost() {
  return new Response("NEW OCR OK");
}function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}    const aiResult = await Promise.race([
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
