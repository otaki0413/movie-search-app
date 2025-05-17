import type { FC } from "react";
import styles from "./Search.module.css";

const YEARS = [2020, 2021, 2022, 2023, 2024] as const;

type SearchProps = {
  keyword: string;
  year: string;
  onKeywordChange: (value: string) => void;
  onYearChange: (value: string) => void;
};

export const Search: FC<SearchProps> = ({
  keyword,
  year,
  onKeywordChange,
  onYearChange,
}) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchForm}>
        <div className={styles.formGroup}>
          <label htmlFor="movieTitle" className={styles.label}>
            Movie Title
          </label>
          <input
            type="text"
            id="movieTitle"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className={styles.input}
            placeholder="映画タイトルを入力"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="releaseYear" className={styles.label}>
            Release Year
          </label>
          <select
            id="releaseYear"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className={styles.select}
          >
            <option value="">選択してください</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
