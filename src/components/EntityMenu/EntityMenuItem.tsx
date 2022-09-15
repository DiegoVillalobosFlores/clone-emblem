import cc from "classcat";
import styles from "./EntityMenuItem.module.scss";
import {Entity} from "../../types";

type Props = {
  entity: Entity;
  selectedEntity?: Entity;
  onEntitySelected: (entity: Entity) => void
}

export default function EntityMenuItem({entity, selectedEntity, onEntitySelected}: Props) {
  return (
    <div
      key={entity.id}
      className={cc([styles.root, selectedEntity?.id === entity.id && styles.root_selected])}
      onClick={() => onEntitySelected(entity)}
    >
      <div>Id: {entity.id}</div>
      <div>Name: {entity.name}</div>
      <div>Health: {entity.health}</div>
      <div>Attack: {entity.attack}</div>
      <div>Defense: {entity.defense}</div>
      <div>Movement: {entity.movement}</div>
      <div>Current Pos: {entity.currentPos?.[0]},{entity.currentPos?.[1]}</div>
    </div>
  )
}