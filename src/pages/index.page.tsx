import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useEffect, useMemo, useState} from "react";
import {Action, Entities, Entity, Position, Tile} from "../types";
import {Grid} from "../components/Grid";
import {ActionsMenu} from "../components/ActionsMenu";
import {EntityMenu} from "../components/EntityMenu";
import {EntityCreateForm} from "../components/EntityCreateForm";
import ndarray from "ndarray";
import {NdArray} from "ndarray";
// @ts-ignore
import createPlanner from 'l1-path-finder';

const defaultEntities: Entities = {
  1: {
    id: 1,
    name: 'Chino',
    currentPos: 8,
    movement: 3,
    attack: 1,
    health: 30,
    defense: 4,
    type: 'player',
    actions: ['Move', 'Attack', 'Select']
  },
  2: {
    id: 2,
    name: 'Luigi',
    currentPos: 3 * 8,
    movement: 8,
    attack: 5,
    health: 30,
    defense: 2,
    type: 'CPU',
    actions: ['Move', 'Attack', 'Select']
  },
  3: {
    id: 3,
    name: 'Diego',
    currentPos: 7 * 7,
    movement: 1,
    attack: 5,
    health: 30,
    defense: 2,
    type: 'CPU',
    actions: ['Move', 'Attack', 'Select']
  }
}

const Home: NextPage = () => {
  const [selectedTile, setSelectedTile] = useState<number | undefined>(undefined);
  const [selectedEntityId, setSelectedEntityId] = useState<Entity['id'] | undefined>(undefined);
  const [binaryGrid, setBinaryGrid] = useState<NdArray | undefined>( undefined);
  const [entities, setEntities] = useState<Entities>(defaultEntities);
  const [planner, setPlanner] = useState<ReturnType<createPlanner> | undefined>(undefined)
  const [path, setPath] = useState<Array<number>>([])

  const getEntityByPos = (position: Position) => {
    return Object.values(entities).find(({currentPos}) => currentPos === position)
  }

  const grid: Array<Tile> = useMemo(() => {
    const tempGrid: Array<Tile> = []
    for(let x = 0 ; x < 8 * 8 ; x++) {
      const entity = getEntityByPos(x)
      if(!entity) tempGrid.push(0)
      else tempGrid.push(entity.id)
    }

    const dGrid = [...tempGrid];
    if(selectedEntityId) {
      const selectedEntity = entities[selectedEntityId]
      if(selectedEntity && selectedEntity && selectedEntity.currentPos) dGrid[selectedEntity.currentPos] = 0
    }
    const tempBinaryGrid = ndarray(dGrid, [8,8])
    setBinaryGrid(tempBinaryGrid)

    return tempGrid
  }, [entities, selectedEntityId])

  useEffect(() => {
    if(!binaryGrid) return
    setPlanner(createPlanner(binaryGrid))
  }, [binaryGrid])

  const handleSelectEntity = (entity: Entity) => {
    if(selectedEntityId === entity.id) setSelectedEntityId(undefined)
    setSelectedEntityId(entity.id)
  }

  const handleEntityAction = (action: Action) => {
    if(action === "Move") moveEntity()
    if(action === "Attack") attackEntity()
    if(action === "Select") selectEntity(selectedTile)
  }

  const moveEntity = () => {
    setPath([])
    if(!selectedEntityId) return
    const selectedEntity = entities[selectedEntityId]
    if(selectedEntity && selectedTile && !getEntityByPos(selectedTile)) setEntities({...entities, [selectedEntity.id]: {
        ...entities[selectedEntity.id],
        currentPos: selectedTile
      }})
  }

  const selectEntity = (tile?: Tile) => {
    if(!tile) return
    const entity = getEntityByPos(tile);
    if(entity) handleSelectEntity(entity)
  }

  const attackEntity = () => {
    if(!selectedEntityId) return;
    const selectedEntity = entities[selectedEntityId]

    if(
      selectedEntity &&
      selectedTile &&
      selectedTile !== 0 &&
      selectedTile !== selectedEntity.currentPos
    ) {
      const attackingEntity = entities[selectedEntity.id];
      const targetEntity = getEntityByPos(selectedTile);

      if(!targetEntity) return;

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
        [targetEntity.id]: {
          ...entities[targetEntity.id],
          health
        }})
    }
  }

  const handleAddEntity = (entity: Entity) => {
    const newId = entity.id;

    if(!newId || newId === 0) return;
    if(entity.name === '') return;

    setEntities({
      ...entities,
      [newId]: entity
    })
  }

  const handleGridClick = (tile: Tile) => {
    setSelectedTile(tile)
    const entity = getEntityByPos(tile);
    if(tile && !selectedEntityId && entity) setSelectedEntityId(entity.id)
  }

  const handleGridHover = (tile: Tile) => {
    if(!selectedEntityId) return;
    const selectedEntity = entities[selectedEntityId]
    if(!selectedEntity || !selectedEntity.currentPos || !binaryGrid || !planner) return
    const tempPath: Array<number> = []
    const tileCoord = [Math.floor(tile / 8), tile % 8]
    planner.search(Math.floor(selectedEntity.currentPos / 8), selectedEntity.currentPos % 8, tileCoord[0], tileCoord[1], tempPath)

    let coordPath = []

    while (tempPath.length > 0) {
      const currentCord = [tempPath.shift(), tempPath.shift()];
      const nextCoord = [tempPath[0], tempPath[1]]

      if(currentCord[0] === undefined) break;
      if(currentCord[1] === undefined) break;

      const coord = currentCord[0] * 8 + currentCord[1] % 8
      coordPath.push(coord)

      const xDiff = currentCord[0] - nextCoord[0];
      const yDiff = currentCord[1] - nextCoord[1];

      if(xDiff === 0) {
        for(let i = yDiff; i < 0 ; i++) {
          coordPath.push(coord - i)
        }

        for(let i = 0; i < yDiff ; i++) {
          coordPath.push(coord - i)
        }
      }

      if(yDiff === 0) {
        for(let i = xDiff; i < 0 ; i++) {
          coordPath.push(coord - (i * 8))
        }

        for(let i = 0; i < xDiff ; i++) {
          coordPath.push(coord - (i * 8))
        }
      }
    }

    setPath(coordPath)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Clone Emblem</title>
        <meta name="description" content="Fire Emblem Clone" />
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          Selected Position: X:{}
        </div>
        <div>
          Selected Entity: {selectedEntityId && entities[selectedEntityId] && entities[selectedEntityId].name}
        </div>
        <Grid
          grid={grid}
          selectedTile={selectedTile}
          onGridClick={handleGridClick}
          onGridHover={handleGridHover}
          path={path}
          entities={entities}
        >
          {
            selectedEntityId &&
            entities[selectedEntityId] &&
            selectedTile &&
              <ActionsMenu
                  entity={entities[selectedEntityId]}
                  onActionClick={handleEntityAction}
              />
          }
        </Grid>
        <h6>Available Units:</h6>
        <EntityCreateForm onEntityCreate={handleAddEntity}/>
        <EntityMenu selectedEntity={selectedEntityId} entities={entities} onEntitySelected={handleSelectEntity}/>
      </main>
    </div>
  )
}

export default Home
