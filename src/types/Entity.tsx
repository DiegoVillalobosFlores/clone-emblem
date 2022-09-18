import Position from "./Position";
import Action from "./Action";

type Entity = {
  id: number;
  name: string;
  currentPos: Position | null;
  movement: number;
  attack: number;
  health: number;
  defense: number;
  type: string;
  actions: Array<Action>;
}

export default Entity;
