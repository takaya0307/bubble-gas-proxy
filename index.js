const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
  try {
    const gasUrl = "https://script.google.com/macros/s/AKfycbwgDiMGovP4su2ZfsH4PggTmFfJVwFTnlfQjtqwg09_FYz6Dg_Z21Sn3VU-RtUJTOiG/exec";

    // ステップ1: POSTを送信（リダイレクトを自動追わず、自分で処理）
    const postResponse = await axios.post(gasUrl, req.body, {
      headers: { "Content-Type": "application/json" },
      maxRedirects: 0, // リダイレクトを手動で処理
      validateStatus: status => status >= 200 && status < 400, // 302 を許可
    });

    // ステップ2: Location ヘッダーからリダイレクト先を取得
    const redirectUrl = postResponse.headers.location;
    if (!redirectUrl) {
      return res.status(500).json({ error: "リダイレクト先が見つかりません。" });
    }

    // ステップ3: GETリクエストをリダイレクト先に送信（←ここ重要）
    const finalResponse = await axios.get(redirectUrl, {
      headers: { "Accept": "application/json" },
    });

    // ステップ4: 最終レスポンスをBubbleへ返却
    res.status(finalResponse.status).json(finalResponse.data);

  } catch (error) {
    console.error("エラー:", error.message);
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.statusText });
    } else {
      res.status(500).json({ error: "予期せぬエラーが発生しました。" });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server is running on port ${PORT}`));