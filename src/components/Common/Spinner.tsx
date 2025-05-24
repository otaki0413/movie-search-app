import type { FC } from "react";
import styles from "./Spinner.module.css";

type SpinnerProps = {
  children?: React.ReactNode;
};

export const Spinner: FC<SpinnerProps> = ({ children }) => {
  return (
    <div className={styles.loadingIndicator}>
      <div className={styles.spinner}></div>
      <span className={styles.loadingText}>{children}</span>
    </div>
  );
};
