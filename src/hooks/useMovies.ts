import { useState, useCallback, useMemo, useEffect } from "react";
import useSWR from "swr";
import type { EnrichedMovie, TMDBApiResponse } from "../types/api/app";

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

export function useMovies(keyword: string, year: string) {
  const [allMovies, setAllMovies] = useState<EnrichedMovie[]>([]); // 全ての映画データ
  const [page, setPage] = useState(1); // 現在のページ番号
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 追加読み込み中フラグ

  // キーワードとリリース年のトリミング
  const trimmedKeyword = keyword.trim();
  const trimmedYear = year.trim();

  // ベースとなる検索条件を生成
  const baseKey = useMemo(() => {
    if (!trimmedKeyword) {
      return null;
    }
    const params = new URLSearchParams();
    params.set("keyword", trimmedKeyword);
    if (trimmedYear) {
      params.set("year", trimmedYear);
    }
    return params.toString();
  }, [trimmedKeyword, trimmedYear]);

  // SWRのキー生成（検索条件とページ数を組み合わせる）
  const swrKey = baseKey ? `/api/movies?${baseKey}&page=${page}` : null;

  // SWRでデータ取得
  const { data, error, isLoading } = useSWR<TMDBApiResponse>(swrKey, fetcher, {
    revalidateIfStale: false, // 古いデータの再検証を無効化
    revalidateOnFocus: false, // フォーカス時の再検証を無効化
    revalidateOnReconnect: false, // 再接続時の再検証を無効化
    dedupingInterval: 300000, // 5分間のデータ重複防止
  });

  // 検索条件変更時にデータリセット
  useEffect(() => {
    setAllMovies([]);
    setPage(1);
    setIsLoadingMore(false);
  }, [trimmedKeyword, trimmedYear]);

  // データ取得後の処理
  useEffect(() => {
    if (!data) {
      return;
    }
    if (page === 1) {
      // 初回ページの場合は上書き
      setAllMovies(data.movies);
    } else {
      // 1ページ目以降の場合は、既存の映画リスト更新
      setAllMovies((prev) => {
        // 重複を避けるために既存IDのチェック
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovies = data.movies.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });
    }
    // 追加読み込み中フラグをリセット
    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [data, page, isLoadingMore]);

  // 追加読み込み処理
  const loadMore = useCallback(() => {
    if (data?.movies && page < data.total_pages && !isLoadingMore) {
      console.log("📥 追加読み込み実行");
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [data, page, isLoadingMore]);

  return {
    movies: allMovies,
    isLoading: isLoading && page === 1,
    isLoadingMore,
    error: error instanceof Error ? error.message : null,
    loadMore,
    hasMorePages: Boolean(data?.movies && page < data.total_pages),
  };
}
