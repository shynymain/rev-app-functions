export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({
        ok: false,
        error: "ファイルなし"
      }), { headers: { "Content-Type": "application/json" } });
    }

    const arrayBuffer = await file.arrayBuffer();

    const base64 = btoa(
      new Uint8Array(arrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: "競馬出馬表をJSONで返して" },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64}`
            }
          ]
        }]
      })
    });

    // ❗ ここ重要（1回だけ読む）
    const text = await res.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return new Response(JSON.stringify({
        ok: false,
        error: "JSONパース失敗",
        raw: text
      }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      ok: true,
      result: json
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
}      "last2": "",
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
