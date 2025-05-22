import { useState, useEffect, useTransition, useCallback } from "react";
import useSWR from "swr";
import type { Movie } from "../types";
import type { TMDBApiResponse, TMDBGenre, TMDBMovie } from "../types/api/tmdb";

// SWRのfetcher関数
const fetcher = async (url: string) => {
  try {
    console.log(`🔍 APIリクエスト実行: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("APIリクエストに失敗しました");
    }
    const data = await res.json();
    console.log(`✅ APIレスポンス受信: ${url}`);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export function useMoviesSWR(keyword: string, year: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // APIリクエスト用のURLパラメータを生成
  const params = new URLSearchParams();
  if (keyword.trim()) {
    params.append("keyword", keyword.trim());
    if (year.trim()) {
      params.append("year", year.trim());
    }
    params.append("page", String(page));
  }

  // SWRのキー生成
  const searchKey = keyword.trim() ? `/api/movies?${params}` : null;

  // SWRでデータ取得
  const { data, error, isLoading } = useSWR<TMDBApiResponse>(
    searchKey,
    fetcher,
    {
      revalidateIfStale: false, // 古いデータでも再利用（キャッシュ優先）
      revalidateOnFocus: false, // フォーカス時に再取得しない
      revalidateOnReconnect: false, // ネットワーク再接続時に再取得しない
      dedupingInterval: 300000, // 5分間は連続して同じリクエストをしない
    }
  );

  // 検索条件が変わったらリセット
  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [keyword, year]);

  // 映画データ処理
  useEffect(() => {
    if (!data) return;

    // useTransitionを利用して、重い処理をノンブロッキングで実行
    startTransition(() => {
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

      // ページ数に応じて、映画データ更新
      setMovies((prev) =>
        page === 1 ? formattedMovies : [...prev, ...formattedMovies]
      );
    });
  }, [data, page]);

  // データ追加読み込み処理
  const loadMore = useCallback(() => {
    if (
      data?.moviesData &&
      data.moviesData.page < data.moviesData.total_pages
    ) {
      setPage((prev) => prev + 1);
    }
  }, [data?.moviesData]);

  // 次のページがあるかどうかの判定
  const hasMorePages = Boolean(
    data?.moviesData && data.moviesData.page < data.moviesData.total_pages
  );

  return {
    movies,
    isLoading: isLoading || isPending,
    error: error instanceof Error ? error.message : null,
    loadMore,
    hasMorePages,
  };
}
