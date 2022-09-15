import styles from "./ActionsMenuButton.module.scss";
import {ReactNode} from "react";

type Props = {
  children: ReactNode;
}

export default function ActionsMenuButton({children}: Props) {
  return (
    <button
      className={styles.root}
    >
      {children}
    </button>
  )
}