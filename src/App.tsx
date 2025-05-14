import { MainLayout } from "./components/Layout/MainLayout";
import { SearchArea } from "./components/SearchArea/SearchArea";

function App() {
  return (
    <MainLayout>
      <SearchArea />
      <div>映画一覧</div>
      <div>映画読込ボタン</div>
    </MainLayout>
  );
}

export default App;
