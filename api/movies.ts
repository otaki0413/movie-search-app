import type { VercelRequest, VercelResponse } from "@vercel/node";

// ローカル環境では、.env.localから環境変数を読み込む
if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config({ path: ".env.local" });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // リクエストパラメータを取得
  const { keyword, year } = req.query;

  // 必須パラメータのチェック
  if (!keyword || typeof keyword !== "string") {
    return res.status(400).json({ error: "Keyword parameter is required" });
  }

  // 環境変数からアクセストークンを取得
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    console.error("TMDB_ACCESS_TOKEN is not defined");
    return res.status(500).json({ error: "Missing TMDB access token" });
  }

  // 映画検索用とジャンル取得用のAPIエンドポイントを設定
  const MOVIE_URL = new URL("https://api.themoviedb.org/3/search/movie");
  const GENRE_URL = new URL("https://api.themoviedb.org/3/genre/movie/list");

  // 映画検索用のURLにクエリパラメータを追加
  MOVIE_URL.searchParams.append("query", keyword);
  if (year && typeof year === "string") {
    MOVIE_URL.searchParams.append("primary_release_year", year);
  }

  // 共通のリクエストヘッダーを設定（アクセストークン付与）
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // APIリクエスト（映画とジャンルを並行取得）
    const [moviesResponse, genresResponse] = await Promise.all([
      fetch(MOVIE_URL, { headers }),
      fetch(GENRE_URL, { headers }),
    ]);

    if (!moviesResponse.ok || !genresResponse.ok) {
      throw new Error("TMDB API error");
    }

    // レスポンスデータをJSON形式で取得
    const [moviesData, genresData] = await Promise.all([
      moviesResponse.json(),
      genresResponse.json(),
    ]);

    res.status(200).json({ moviesData, genres: genresData.genres });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
