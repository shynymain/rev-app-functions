prompt: `
この画像は競馬の出馬表・オッズ・結果画面です。
画像内の文字を読み取り、説明文は不要でJSONだけ返してください。

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

読めない項目は空文字。
`
