import styles from "./Grid.module.scss";
import cc from "classcat";
import {Position, Tile} from "../../types";
import {ReactNode} from "react";
import {EntityPortrait} from "../EntityPortrait";

type Props = {
  grid: Array<Array<Tile>>;
  selectedTile?: Tile;
  onGridClick: (tile: Tile) => void;
  children: ReactNode;
}

export default function Grid({grid, selectedTile, onGridClick, children}: Props) {
  const isSelectedPos = (position: Position) => {
    if(!selectedTile) return false
    if(position === null) return false
    if(position[0] !== selectedTile.position[0]) return false;

    return position[1] === selectedTile.position[1];
  }

  return (
    <div className={styles.gridContainer}>
      <div>
        {grid.map((tiles, x) => (
          <div key={`grid_${x}_0`} className={cc([styles.tile, styles.tile_container])}>
            {tiles.map((tile, y) => (
              <div
                key={`grid_${x}_${y}`}
                className={cc([styles.tile, styles.tile_grass, isSelectedPos([x,y]) && styles.tile_selected])}
                onClick={() => onGridClick(tile)}
              >
                {tile.entity && <EntityPortrait entity={tile.entity} />}
                {selectedTile && isSelectedPos(tile.position) && children}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}