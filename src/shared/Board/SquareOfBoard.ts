import Board from './Board';

type StateOfMark = Record<string, any>;

class SquareOfBoard {
  public readonly x: number;
  public readonly y: number;
  public readonly stateOfMark: StateOfMark = {};
  public mark: Mark | ' ' = ' ';

  constructor(public readonly coordinate: Coordinate, public readonly board: Board) {
    [this.x, this.y] = coordinate;
  }

  public to([dx, dy]: Coordinate): SquareOfBoard | null {
    const x = this.x + dx;
    const y = this.y + dy;
    return this.board.squares[x]?.[y] || null;
  }
}

export default SquareOfBoard;
