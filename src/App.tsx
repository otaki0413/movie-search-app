import { MainLayout } from "./components/Layout/MainLayout";
import { MovieList } from "./components/MovieList/MovieList";
import { Search } from "./components/Search/Search";

function App() {
  return (
    <MainLayout>
      <Search />
      <MovieList movies={MOCK_MOVIES} />
    </MainLayout>
  );
}

export default App;

// 仮のデータ（後でAPIから取得するデータに置き換え）
const MOCK_MOVIES = [
  {
    id: 1,
    title: "サンプル映画1",
    thumbnail: "https://via.placeholder.com/300x450",
    releaseDate: "2024-01-15",
    genres: ["アクション", "SF"],
  },
  {
    id: 2,
    title: "サンプル映画2",
    thumbnail: "https://via.placeholder.com/300x450",
    releaseDate: "2024-02-20",
    genres: ["ドラマ", "ミステリー"],
  },
  {
    id: 3,
    title: "サンプル映画3",
    thumbnail: "https://via.placeholder.com/300x450",
    releaseDate: "2024-03-10",
    genres: ["コメディ", "ロマンス"],
  },
  {
    id: 4,
    title: "サンプル映画4",
    thumbnail: "https://via.placeholder.com/300x450",
    releaseDate: "2024-04-05",
    genres: ["ホラー", "スリラー"],
  },
  {
    id: 5,
    title: "サンプル映画5",
    thumbnail: "https://via.placeholder.com/300x450",
    releaseDate: "2024-05-25",
    genres: ["アニメ", "ファンタジー"],
  },
];
