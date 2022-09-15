import {Entity} from "../../types";
import styles from './EntityPortrait.module.scss'

type Props = {
  entity: Entity
}

export default function EntityPortrait({entity}: Props) {
  return (
    <span className={styles.root}>{entity.name.toUpperCase()[0]}</span>
  )
}