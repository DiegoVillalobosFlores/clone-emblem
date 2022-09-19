import styles from "./Grid.module.scss";
import cc from "classcat";
import {Entities, Position, Tile} from "../../types";
import {ReactNode} from "react";
import {EntityPortrait} from "../EntityPortrait";


type Props = {
  grid: Array<Tile>;
  selectedTile?: number;
  children: ReactNode;
  entities: Entities;
  path: Array<number>;
  onGridClick: (tile: Tile) => void;
  onGridHover: (tile: Tile) => void;
}

export default function Grid({
    grid,
    path,
    onGridHover,
    selectedTile,
    onGridClick,
    children,
    entities
  }: Props) {

  const isSelectedPos = (position: Position) => {
    if(!selectedTile) return false
    if(position === null) return false

    return position === selectedTile;
  }

  return (
    <div className={styles.gridContainer}>
      {grid.map((tile, x) => (
        <div key={`grid_${x}_0`} className={cc([styles.tile, styles.tile_container])}>
          <div
            key={`grid_${x}`}
            className={cc([
              styles.tile,
              styles.tile_grass,
              path.includes(x) && styles.tile_possible_movement,
              path.at(-1) === x && styles.tile_last_movement,
              isSelectedPos(x) && styles.tile_selected
            ])}
            onClick={() => onGridClick(x)}
            onMouseOver={() => onGridHover(x)}
          >
            {entities[tile] && <EntityPortrait entity={entities[tile]} />}
            {selectedTile === x && children}
          </div>
        </div>
      ))}
    </div>
  )
}