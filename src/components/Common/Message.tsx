import type { FC } from "react";
import styles from "./Message.module.css";

type MessageProps = {
  children: React.ReactNode;
};

export const Message: FC<MessageProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.message}>{children}</div>
    </div>
  );
};
