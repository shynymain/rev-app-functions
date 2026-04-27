prompt: `
あなたはOCR専用エンジンです。

以下を厳守：
・説明文は禁止
・Pythonコード禁止
・文章禁止
・JSONのみ出力
・``` やコードブロック禁止

出力形式は完全一致：

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

この形式以外は絶対に出力しない。

画像内の競馬データを抽出せよ。
`
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
