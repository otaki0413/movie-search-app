import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import type { TMDBApiResponse } from "../types/api/app";

// SWRのfetcher関数
const fetcher = async (url: string) => {
  try {
    console.log(`🔍 APIリクエスト実行: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`APIエラー: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`✅ APIレスポンス受信`);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export function useMoviesSWR(keyword: string, year: string) {
  const [page, setPage] = useState(1);

  const trimmedKeyword = keyword.trim();
  const trimmedYear = year.trim();

  // ベースの検索条件を生成
  const baseParams = useMemo(() => {
    if (!trimmedKeyword) {
      return null;
    }
    const params = new URLSearchParams();
    params.set("keyword", trimmedKeyword);
    if (trimmedYear) {
      params.set("year", trimmedYear);
    }
    return params;
  }, [trimmedKeyword, trimmedYear]);

  // 検索キー生成（検索条件とページ数を組み合わせる）
  const swrKey = useMemo(() => {
    if (!baseParams) {
      return null;
    }
    return `/api/movies?${baseParams.toString()}&page=${page}`;
  }, [baseParams, page]);

  // SWRでデータ取得
  const { data, error, isLoading, isValidating } = useSWR<TMDBApiResponse>(
    swrKey,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
      keepPreviousData: true,
    }
  );

  // 追加読み込み処理
  const loadMore = useCallback(() => {
    if (data?.movies && page < data.total_pages) {
      setPage((prev) => prev + 1);
    }
  }, [data, page]);

  return {
    movies: data?.movies || [],
    isLoading: (isLoading && page === 1) || isValidating,
    error: error instanceof Error ? error.message : null,
    loadMore,
    hasMorePages: Boolean(data?.movies && page < data.total_pages),
  };
}
