import { useState } from "react";
import { Message } from "./components/Common/Message";
import { MainLayout } from "./components/Layout/MainLayout";
import { MovieList } from "./components/MovieList/MovieList";
import { Search } from "./components/Search/Search";
import { useMovies } from "./hooks/useMovies";

function App() {
  const [keyword, setKeyword] = useState("");
  const [year, setYear] = useState("");
  const { movies, isLoading, error } = useMovies(keyword, year);

  const renderContent = () => {
    if (isLoading) return <Message>Loading...</Message>;
    if (error) return <Message>{error}</Message>;
    if (!keyword)
      return <Message>検索フォームからキーワードを入力してください</Message>;
    return <MovieList movies={movies} />;
  };

  return (
    <MainLayout>
      <Search
        keyword={keyword}
        year={year}
        onKeywordChange={setKeyword}
        onYearChange={setYear}
      />
      {renderContent()}
    </MainLayout>
  );
}

export default App;
