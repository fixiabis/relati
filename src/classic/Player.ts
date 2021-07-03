import SquareOfBoard from '../shared/Board/SquareOfBoard';

class Player {
  constructor(public readonly mark: Mark) {}

  public placeMark(square: SquareOfBoard): void {
    square.mark = this.mark;
    square.board.stateOfMarks[this.mark].isPlaced = true;
  }
}

export default Player;
