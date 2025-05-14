import type { FC } from "react";
import type { Movie } from "../../types";
import styles from "./MovieList.module.css";

type MovieListProps = {
  movies: Movie[];
};

export const MovieList: FC<MovieListProps> = ({ movies }) => {
  return (
    <div className={styles.movieList}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
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
