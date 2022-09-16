import styles from "./Grid.module.scss";
import cc from "classcat";
import {Entity, Position, Tile} from "../../types";
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

  const getObstacles = (position: Position, currentEntityId: Entity["id"], xDiff: number, yDiff: number) => {
    let obstacle = 0

    if(yDiff === 0) {
      let index = xDiff < 0 ? xDiff : 0;
      let end = xDiff < 0 ? 0 : xDiff
      for (index; index <= end; index++){
        const entityTile = grid[position[0] - index][position[1]]

        if (entityTile.entity && entityTile.entity.id !== currentEntityId) obstacle = obstacle + 2
      }
    }

    if(xDiff === 0) {
      let index = yDiff < 0 ? yDiff : 0;
      let end = yDiff < 0 ? 0 : yDiff

      for (index; index <= end; index++) {
        const entityTile = grid[position[0]][position[1] - index]

        if (entityTile.entity && entityTile.entity.id !== currentEntityId) obstacle = obstacle + 2
      }
    }

    return obstacle
  }

  const isValidMovementTile = (position: Position) => {
    const tile = selectedTile

    if(!tile?.entity) return false;

    const {currentPos} = tile.entity

    if(!currentPos) return false
    const xDiff = position[0] - currentPos[0]
    const yDiff = position[1] - currentPos[1]

    const diffSum = Math.abs(xDiff) + Math.abs(yDiff);

    if(diffSum <= tile.entity.movement) {
      const obstacle = getObstacles(position, tile.entity.id, xDiff, yDiff)

      return diffSum + obstacle <= tile.entity.movement
    }

    return false
  }

  return (
    <div className={styles.gridContainer}>
      {grid.map((tiles, x) => (
        <div key={`grid_${x}_0`} className={cc([styles.tile, styles.tile_container])}>
          {tiles.map((tile, y) => (
            <div
              key={`grid_${x}_${y}`}
              className={cc([
                styles.tile,
                styles.tile_grass,
                isValidMovementTile([x,y]) && styles.tile_possible_movement,
                isSelectedPos([x,y]) && styles.tile_selected])}
              onClick={() => onGridClick(tile)}
            >
              {tile.entity && <EntityPortrait entity={tile.entity} />}
              {selectedTile && isSelectedPos(tile.position) && children}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}