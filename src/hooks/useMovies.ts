import { useState, useEffect } from "react";
import type { Movie } from "../types";
import type { TMDBApiResponse, TMDBMovie, TMDBGenre } from "../types/api/tmdb";

export const useMovies = (keyword: string, year: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 検索条件が変更したとき、ページ数を1に戻す
    setPageNum(1);
  }, [keyword, year]);

  useEffect(() => {
    // キーワードが空の場合は、検索結果をクリア
    if (!keyword.trim()) {
      setMovies([]);
      return;
    }

    // 映画データの取得処理
    const fetchMovies = async () => {
      // ローディング開始
      setIsLoading(true);
      setError(null);

      try {
        // APIリクエスト用のURLパラメータを生成
        const params = new URLSearchParams();
        params.append("keyword", keyword.trim());
        if (year) {
          params.append("year", year);
        }
        params.append("page", String(pageNum));

        // APIリクエスト実行
        const response = await fetch(`/api/movies?${params}`);
        if (!response.ok) {
          throw new Error("APIリクエストに失敗しました");
        }
        // APIレスポンス取得
        const data: TMDBApiResponse = await response.json();

        // ジャンルIDとジャンル名のマッピングを作成
        const genreMap = new Map<number, string>();
        data.genres.forEach((genre: TMDBGenre) => {
          genreMap.set(genre.id, genre.name);
        });

        // APIレスポンスの映画データをアプリケーション用に整形
        const formattedMovies = data.moviesData.results.map(
          (movie: TMDBMovie) => ({
            id: movie.id,
            title: movie.title,
            thumbnail:
              movie.poster_path &&
              `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            releaseDate: movie.release_date,
            genres: movie.genre_ids.map((id) => genreMap.get(id) || ""),
          })
        );
        // ページ数に応じた映画データの格納（ページ版号）
        setMovies((prev) =>
          pageNum === 1 ? formattedMovies : [...prev, ...formattedMovies]
        );
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("予期しないエラーが発生しました");
        }
        setMovies([]);
      } finally {
        // ローディング終了
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [keyword, year, pageNum]);

  return {
    movies,
    isLoading,
    error,
    loadMore: () => setPageNum((prev) => prev + 1),
  };
};
