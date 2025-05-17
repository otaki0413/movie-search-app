import { useState } from "react";
import { MainLayout } from "./components/Layout/MainLayout";
import { MovieList } from "./components/MovieList/MovieList";
import { Search } from "./components/Search/Search";
import { useMovies } from "./hooks/useMovies";

function App() {
  const [keyword, setKeyword] = useState("");
  const [year, setYear] = useState("");
  const { movies, isLoading, error } = useMovies(keyword, year);

  return (
    <MainLayout>
      <Search
        keyword={keyword}
        year={year}
        onKeywordChange={setKeyword}
        onYearChange={setYear}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading && !error && <MovieList movies={movies} />}
    </MainLayout>
  );
}

export default App;
