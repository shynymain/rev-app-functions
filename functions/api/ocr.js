export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("ファイルなし", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    const base64 = btoa(
      new Uint8Array(arrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    const response = await env.AI.run(
      "@cf/meta/llama-3.2-11b-vision-instruct",
      {
        messages: [
          {
            role: "system",
            content: "agree"   // ←これが超重要
          },
          {
            role: "user",
            content: [
              {
                type: "image",
                image: base64
              },
              {
                type: "text",
                text: "この画像の競馬出馬表を読み取って、馬番・馬名・前走・前2走・前3走を抽出"
              }
            ]
          }
        ]
      }
    );

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response("ERROR: " + e.message);
  }
}
