import type { FC } from "react";
import type { Movie } from "../../types";
import styles from "./MovieList.module.css";

type MovieListProps = {
  movies: Movie[];
  loadMore: () => void;
};
export const MovieList: FC<MovieListProps> = ({ movies, loadMore }) => {
  return (
    <div className={styles.movieListContainer}>
      <div className={styles.movieCount}>検索結果：{movies.length}件</div>
      {movies.length === 0 ? (
        <p className={styles.alertText}>該当する映画が見つかりませんでした。</p>
      ) : (
        <>
          <div className={styles.movieList}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className={styles.movieButtonArea}>
            <button onClick={loadMore} className={styles.movieReadButton}>
              More Read
            </button>
          </div>
        </>
      )}
    </div>
  );
};

type MovieCardProps = {
  movie: Movie;
};

const MovieCard: FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className={styles.card}>
      <img
        src={movie.thumbnail}
        alt={movie.title}
        className={styles.thumbnail}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.releaseDate}>{movie.releaseDate}</p>
        <div className={styles.genres}>
          {movie.genres.map((genre) => (
            <span key={genre} className={styles.genre}>
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
