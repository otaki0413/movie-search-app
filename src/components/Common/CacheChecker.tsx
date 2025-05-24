import { useState } from "react";
import styles from "./CacheChecker.module.css";

export const CacheChecker = () => {
  const [count, setCount] = useState(0);
  return (
    <div className={styles.cacheChecker}>
      <h3>キャッシュ動作確認</h3>
      <p>
        同じキーワードで検索した場合、5分間はAPIリクエストが発生しません。
        <br />
        コンソールを確認してください。
      </p>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
        className={styles.refreshButton}
      >
        UI再レンダリング ({count})
      </button>
      <p className={styles.note}>
        このボタンを押してもAPIリクエストが発生しなければキャッシュが機能しています
      </p>
    </div>
  );
};
