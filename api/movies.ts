import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { TMDBApiResponse, EnrichedMovie } from "../src/types/api/app";
import {
  TMDBMoviesResponse,
  TMDBGenresResponse,
  TMDBGenre,
  TMDBMovie,
} from "./../src/types/api/tmdb";

// ローカル環境では、.env.localから環境変数を読み込む
if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config({ path: ".env.local" });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // リクエストパラメータを取得
  const { keyword, year, page } = req.query;

  // 必須パラメータのチェック
  if (!keyword || typeof keyword !== "string") {
    return res.status(400).json({ error: "Keyword parameter is required" });
  }

  // ページのチェック（※APIの仕様上、1以上500以下の整数である必要がある）
  if (page && typeof page === "string") {
    const pageNum = Number(page);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 500) {
      return res
        .status(400)
        .json({ error: "Page parameter must be between 1 and 500" });
    }
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
  if (page && typeof page === "string") {
    MOVIE_URL.searchParams.append("page", page);
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
      moviesResponse.json() as Promise<TMDBMoviesResponse>,
      genresResponse.json() as Promise<TMDBGenresResponse>,
    ]);

    // ジャンルIDとジャンル名のマッピング処理
    const genreMap = new Map<number, string>();
    genresData.genres.forEach((genre: TMDBGenre) => {
      genreMap.set(genre.id, genre.name);
    });

    // 映画データの整形
    const formattedMovies = moviesData.results.map((movie: TMDBMovie) => {
      return {
        id: movie.id,
        title: movie.title,
        thumbnail: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/no-Image.png",
        releaseDate: movie.release_date,
        genres: movie.genre_ids.map((id) => genreMap.get(id) || ""),
      };
    });

    // レスポンスを返す
    res.status(200).json({
      movies: formattedMovies as EnrichedMovie[],
      total_pages: moviesData.total_pages,
    } satisfies TMDBApiResponse);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
