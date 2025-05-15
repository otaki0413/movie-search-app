import styles from "./Search.module.css";

export const Search = () => {
  const years = [2020, 2021, 2022, 2023, 2024];

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
            className={styles.input}
            placeholder="映画タイトルを入力"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="releaseYear" className={styles.label}>
            Release Year
          </label>
          <select id="releaseYear" className={styles.select}>
            <option value="">選択してください</option>
            {years.map((year) => (
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
