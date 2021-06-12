import Board from './Board';
import Placement from './interfaces/Placement';

class Player {
  public actionsRemaining: number = 0;

  constructor(public readonly mark: Mark) {}

  public takePlacement(board: Board, coordinate: Coordinate): Placement {
    return { board, coordinate, mark: this.mark };
  }
}

export default Player;
