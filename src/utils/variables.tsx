import {Entity} from "../types";

export const defaultEntity: Entity = {
  id: '',
  name: '',
  currentPos: null,
  movement: 1,
  attack: 1,
  health: 100,
  defense: 1,
  type: 'player',
  actions: ['Move', 'Attack', 'Select']
}
