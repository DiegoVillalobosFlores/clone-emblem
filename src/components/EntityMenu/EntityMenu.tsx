import styles from "./EntityMenu.module.scss";
import {Entities, Entity} from "../../types";
import EntityMenuItem from "./EntityMenuItem";

type Props = {
  entities: Entities;
  selectedEntity?: Entity['id'];
  onEntitySelected: (entity: Entity) => void
}

export default function EntityMenu({entities, onEntitySelected, selectedEntity}:Props) {
  return (
    <div className={styles.root}>
      {Object.values(entities).map(entity =>
        <EntityMenuItem onEntitySelected={onEntitySelected} key={entity.id} entity={entity} selectedEntity={selectedEntity}/>
      )}
    </div>
  )
}