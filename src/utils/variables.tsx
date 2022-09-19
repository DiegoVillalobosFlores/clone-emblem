import {Entity} from "../types";

export const defaultEntity: Entity = {
  id: -1,
  name: '',
  currentPos: null,
  movement: 1,
  attack: 1,
  health: 100,
  defense: 1,
  type: 'player',
  actions: {
    Move: true,
    Attack: true,
    Select: true,
  },
  currentPath: []
}
