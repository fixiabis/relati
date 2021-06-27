import SquareOfBoard from './Board/SquareOfBoard';

class Player {
  constructor(public readonly mark: Mark) {}

  public placeMark(square: SquareOfBoard): void {
    square.mark = this.mark;
    square.board.isMarkPlaced[this.mark] = true;
  }
}

export default Player;
