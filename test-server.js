const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ サーバー起動成功");
});

app.listen(4000, '0.0.0.0', () => {
  console.log("✅ テストサーバーがポート4000で起動しました");
});