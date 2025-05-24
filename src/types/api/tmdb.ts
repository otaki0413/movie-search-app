// TMDBの映画データの型定義
export type TMDBMovie = {
  adult: boolean;
  backdrop_path?: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path?: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// TMDBのジャンルデータの型定義
export type TMDBGenre = {
  id: number;
  name: string;
};

// TMDBの映画検索APIのレスポンス
export type TMDBMoviesResponse = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

// TMDBのジャンル一覧APIのレスポンス
export type TMDBGenresResponse = {
  genres: TMDBGenre[];
};
