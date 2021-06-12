import Board from './Board';
import CannonAttack from './interfaces/CannonAttack';
import CannonChange from './interfaces/CannonChange';
import Placement from './interfaces/Placement';

class Player {
  public actionsRemaining: number = 0;

  constructor(public readonly mark: Mark) {}

  public takePlacement(board: Board, coordinate: Coordinate): Placement {
    return { board, coordinate, mark: this.mark };
  }

  public makeCannonMark(board: Board, coordinate: Coordinate): CannonChange {
    return { board, coordinate, mark: this.mark };
  }

  public fireCannonMark(board: Board, coordinate: Coordinate, direction: Coordinate): CannonAttack {
    return { board, coordinate, direction, mark: this.mark };
  }
}

export default Player;
