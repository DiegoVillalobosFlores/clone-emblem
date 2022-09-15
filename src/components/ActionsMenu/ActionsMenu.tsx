import styles from "./ActionsMenu.module.scss";
import ActionsMenuButton from "./ActionsMenuButton";
import {Action, Entity} from "../../types";

type Props = {
  entity?: Entity;
  onActionClick: (action: Action) => void;
}

export default function ActionsMenu({entity, onActionClick}: Props) {
  return (
    <div className={styles.root}>
      {entity && entity.actions.map(action => (
        <div
          key={action}
          className={styles.actionButtonContainer}
          onClick={() => onActionClick(action)}
        >
          <ActionsMenuButton>
            {action}
          </ActionsMenuButton>
        </div>
      ))}
    </div>
  )
}