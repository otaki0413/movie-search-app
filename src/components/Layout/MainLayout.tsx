import type { FC } from "react";
import styles from "./MainLayout.module.css";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Movie Search App</h1>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2025 otaki0413</p>
      </footer>
    </div>
  );
};
