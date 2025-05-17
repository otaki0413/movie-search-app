import { useState, useEffect } from "react";
import { MainLayout } from "./components/Layout/MainLayout";
import { MovieList } from "./components/MovieList/MovieList";
import { Search } from "./components/Search/Search";
import type { Movie } from "./types";
import type { TMDBApiResponse, TMDBGenre, TMDBMovie } from "./types/api/tmdb";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    // キーワードが空の場合は、検索結果をクリア
    if (!keyword.trim()) {
      setMovies([]);
      return;
    }
    // ローディング開始
    setIsLoading(true);
    setError(null);

    const fetchMovies = async () => {
      try {
        // APIリクエスト用のURLパラメータを生成
        const params = new URLSearchParams({
          keyword: keyword.trim(),
          ...(year && { year }),
        });

        // APIリクエスト
        const response = await fetch(`/api/movies?${params}`);
        if (!response.ok) {
          throw new Error(
            response.body?.toString() || "APIリクエストに失敗しました"
          );
        }
        const data: TMDBApiResponse = await response.json();

        // ジャンルIDと名前のマッピングを作成
        const genreMap = new Map<number, string>();
        data.genres.forEach((genre: TMDBGenre) => {
          genreMap.set(genre.id, genre.name);
        });

        // APIレスポンスのデータをアプリケーション用に整形
        const formattedMovies = data.moviesData.results.map(
          (movie: TMDBMovie) => ({
            id: movie.id,
            title: movie.title,
            thumbnail:
              movie.poster_path &&
              `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            releaseDate: movie.release_date,
            genres: movie.genre_ids.map(
              (genreId) => genreMap.get(genreId) || ""
            ),
          })
        );

        setMovies(formattedMovies);
      } catch (error) {
        if (error instanceof Error) console.error(error);
        setError(
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました"
        );
        setMovies([]);
      } finally {
        // ローディング終了
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [keyword, year]);

  return (
    <MainLayout>
      <Search
        keyword={keyword}
        year={year}
        onKeywordChange={setKeyword}
        onYearChange={setYear}
      />
      {isLoading && <div>読み込み中...</div>}
      {error && <div>{error}</div>}
      {!isLoading && !error && <MovieList movies={movies} />}
    </MainLayout>
  );
}

export default App;
