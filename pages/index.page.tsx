import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useMemo, useState} from "react";
import {Action, Entities, Entity, Position, Tile} from "../src/types";
import {Grid} from "../src/components/Grid";
import {ActionsMenu} from "../src/components/ActionsMenu";
import {EntityMenu} from "../src/components/EntityMenu";
import {EntityCreateForm} from "../src/components/EntityCreateForm";

const Home: NextPage = () => {
  const [selectedTile, setSelectedTile] = useState<Tile | undefined>(undefined);
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>(undefined);
  const [entities, setEntities] = useState<Entities>({
    tuCosita: {
      id: 'tuCosita',
      name: 'Chino',
      currentPos: null,
      movement: 5,
      attack: 1,
      health: 30,
      defense: 4,
      type: 'player',
      actions: ['Move', 'Attack', 'Select']
    },
    Luigi: {
      id: 'Luigi',
      name: 'Luigi',
      currentPos: null,
      movement: 8,
      attack: 5,
      health: 30,
      defense: 2,
      type: 'CPU',
      actions: ['Move', 'Attack', 'Select']
    }}
  )


  const getEntityByPos = (position: Position) => {
    return Object.values(entities).find(({id,currentPos}) => currentPos?.[0] === position?.[0] && currentPos?.[1] === position?.[1])
  }

  const grid: Array<Array<Tile>> = useMemo(() => {
    const tempGrid: Array<Array<Tile>> = []
    for(let x = 0 ; x < 8 ; x++) {
      tempGrid[x] = []
      for(let y = 0 ; y < 8 ; y++) {
        const entity = getEntityByPos([x,y])
        if(entity) tempGrid[x][y] = {
          position: [x,y],
          entity
        }
        else tempGrid[x][y] = {
          position: [x,y]
        }
      }
    }

    return tempGrid
  }, [entities])

  const handleSelectEntity = (entity: Entity) => {
    if(selectedEntity === entity) setSelectedEntity(undefined)
    else setSelectedEntity(entity)
  }

  const handleEntityAction = (action: Action) => {
    if(action === "Move") moveEntity()
    if(action === "Attack" && selectedTile?.entity) attackEntity()
    if(action === "Select") selectEntity()
  }

  const moveEntity = () => {
    if(selectedEntity && selectedTile && !selectedTile.entity) setEntities({...entities, [selectedEntity.id]: {
        ...entities[selectedEntity.id],
        currentPos: selectedTile.position
      }})
  }

  const selectEntity = () => {
    if(selectedTile && selectedTile.entity) setSelectedEntity(entities[selectedTile?.entity?.id])
  }

  const attackEntity = () => {
    if(
      selectedEntity &&
      selectedTile?.entity !== selectedEntity &&
      selectedTile?.entity
    ) {
      const attackingEntity = entities[selectedEntity.id];
      const targetEntity = entities[selectedTile.entity?.id];

      if(targetEntity.health === 0) return

      const health = Math.max(
        0,
        targetEntity.health - (
          Math.max(
            0,
            attackingEntity.attack - targetEntity.defense
          )
        )
      )

      setEntities({...entities,
        [selectedTile.entity.id]: {
          ...entities[selectedTile.entity.id],
          health
        }})
    }
  }

  const handleAddEntity = (entity: Entity) => {
    const newId = entity.id;

    if(!newId || newId === '') return;
    if(entity.name === '') return;

    setEntities({
      ...entities,
      [newId]: entity
    })
  }

  const handleGridClick = (tile: Tile) => {
    setSelectedTile(tile)
    if(!selectedEntity && tile.entity?.id) setSelectedEntity(entities[tile.entity.id])
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
          Selected Position: X:{selectedTile?.position[0]}, Y:{selectedTile?.position[1]}
        </div>
        <div>
          Selected Entity: {selectedEntity?.id}
        </div>
        <Grid
          grid={grid}
          selectedTile={selectedTile}
          onGridClick={handleGridClick}
        >
          {
            selectedEntity &&
            selectedTile &&
              <ActionsMenu
                  entity={selectedEntity}
                  onActionClick={handleEntityAction}
              />}
        </Grid>
        <h6>Available Units:</h6>
        <EntityCreateForm onEntityCreate={handleAddEntity}/>
        <EntityMenu selectedEntity={selectedEntity} entities={entities} onEntitySelected={handleSelectEntity}/>
      </main>
    </div>
  )
}

export default Home
