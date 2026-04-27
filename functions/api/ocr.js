const response = await env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", {
  image: bytes,
  prompt,
  raw: true,
  extraHeaders: {
    "x-cf-ai-accept-terms": "true"
  }
});    "third": "",
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
