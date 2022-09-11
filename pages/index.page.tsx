import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import cc from 'classcat'
import {useMemo, useState} from "react";

type Entity = {
  id: string;
  name: string;
  currentPos: Position;
  movement: number;
  attack: number;
  health: number;
  defense: number;
  type: string;
}

type Entities = Record<string, Entity>

type Position = Array<number> | null

const Home: NextPage = () => {
  const [selectedPos, setSelectedPos] = useState<Position>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity["id"] | null>(null);
  const [entities, setEntities] = useState<Entities>({
    tuCosita: {
      id: 'tuCosita',
      name: 'Chino',
      currentPos: [7, 7],
      movement: 5,
      attack: 1,
      health: 30,
      defense: 5,
      type: 'player'
    },
    Luigi: {
      id: 'Luigi',
      name: 'Luigi',
      currentPos: [5, 1],
      movement: 8,
      attack: 5,
      health: 30,
      defense: 2,
      type: 'CPU'
    }}
  )

  const getEntityByPos = (x: number, y: number) => {
    return Object.values(entities).find(({id,currentPos}) => currentPos?.[0] === x && currentPos[1] === y)
  }

  const grid = useMemo(() => {
    const tempGrid: Array<Array<string | null>> = []
    for(let x = 0 ; x < 8 ; x++) {
      tempGrid[x] = []
      for(let y = 0 ; y < 8 ; y++) {
        const entity = getEntityByPos(x, y)
        if(entity) tempGrid[x][y] = entity.id
        else tempGrid[x][y] = null
      }
    }

    return tempGrid
  }, [entities])


  const handleGridClick = (yPos: number, xPos: number, entityId: Entity["id"] | null) => {
    setSelectedPos([yPos, xPos])
    if(!entityId && selectedEntity) setEntities({...entities, [selectedEntity]: {
      ...entities[selectedEntity],
        currentPos: [yPos, xPos]
      }})
    if(entityId) setSelectedEntity(entityId)
  }

  const isSelectedPos = (yPos: number, xPos: number) => {
    if(selectedPos === null) return false
    if(yPos !== selectedPos[0]) return false;

    return xPos === selectedPos[1];
  }

  const handleSelectEntity = (entityId: Entity["id"]) => {
    if(selectedEntity === entityId) setSelectedEntity(null)
    else setSelectedEntity(entityId)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Clone Emblem</title>
        <meta name="description" content="Fire Emblem Clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          Selected Position: X:{selectedPos?.[0]}, Y:{selectedPos?.[1]}
        </div>
        <div>
          Selected Entity: {selectedEntity}
        </div>
        {grid.map((row, rowIndex) => (
          <div key={`grid_${rowIndex}_0`} className={cc([styles.tile, styles.tile_container])}>
            {row.map((entityId, colIndex) => (
              <div
                key={`grid_${rowIndex}_${colIndex}`}
                className={cc([styles.tile, styles.tile_grass, isSelectedPos(rowIndex, colIndex) && styles.tile_selected])}
                onClick={() => handleGridClick(rowIndex, colIndex, entityId)}
              >
                {entityId && entities[entityId] && <>{entities[entityId].name[0].toUpperCase()}</>}
              </div>
            ))}
          </div>
        ))}
        <h6>Available Units:</h6>
        <div className={styles.entityMenuContainer}>
          {Object.values(entities).map(entity =>
            <div
              key={entity.id}
              className={cc([styles.entityContainer, selectedEntity === entity.id && styles.entityContainer_selected])}
              onClick={() => handleSelectEntity(entity.id)}
            >
              <div>Id: {entity.id}</div>
              <div>Name: {entity.name}</div>
              <div>Health: {entity.health}</div>
              <div>Attack: {entity.attack}</div>
              <div>Defense: {entity.defense}</div>
              <div>Movement: {entity.movement}</div>
              <div>Current Pos: {entity.currentPos?.[0]},{entity.currentPos?.[1]}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
