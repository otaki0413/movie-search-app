// 整形済みの映画データ
export type EnrichedMovie = {
  id: number;
  title: string;
  releaseDate: string;
  thumbnail: string;
  genres: string[];
};

// Vercel Functions経由で返すAPIレスポンス全体
export type TMDBApiResponse = {
  movies: EnrichedMovie[];
  total_pages: number;
};
