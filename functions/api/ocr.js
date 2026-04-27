const response = await env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", {
  image: bytes,
  prompt,
  raw: true,
  extraHeaders: {
    "x-cf-ai-accept-terms": "true"
  }
});
