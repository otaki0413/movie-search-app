import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";

// ローカル環境の場合、.env.localの環境変数を読み込む
dotenv.config({ path: ".env.local" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // リクエストパラメータを取得
  const { keyword, year } = req.query;

  // 必須パラメータのチェック
  if (!keyword || typeof keyword !== "string") {
    return res.status(400).json({ error: "Keyword parameter is required" });
  }

  // URLオブジェクトを作成（APIのエンドポイントを設定する）
  const API_URL = new URL("https://api.themoviedb.org/3/search/movie");

  // キーワードをクエリパラメータに追加
  API_URL.searchParams.append("query", keyword);
  // 公開年の指定がある場合は、クエリパラメータに追加
  if (year && typeof year === "string") {
    API_URL.searchParams.append("primary_release_year", year);
  }

  try {
    // 環境変数からアクセストークンを取得
    const token = process.env.TMDB_ACCESS_TOKEN;
    if (!token) {
      console.error("TMDB_ACCESS_TOKEN is not defined");
      return res.status(500).json({ error: "Missing TMDB access token" });
    }

    // APIリクエスト（アクセストークンをヘッダー付与）
    const response = await fetch(API_URL.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: "TMDB API error" });
    }

    // レスポンスデータをJSON形式で取得
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
