export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({
        ok: false,
        error: "ファイルなし"
      }), { headers: { "Content-Type": "application/json" } });
    }

    const buffer = await file.arrayBuffer();
    const bytes = [...new Uint8Array(buffer)];

    // ★ここでタイムアウト制御
    const result = await Promise.race([
      env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", {
        image: bytes,
        prompt: "agree"
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 15000)
      )
    ]);

    return new Response(JSON.stringify({
      ok: true,
      result
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      ok: false,
      error: e.message
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}              }
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
