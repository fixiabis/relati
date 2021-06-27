import SquareOfBoard from './SquareOfBoard';

class Board {
  public readonly coordinates: Coordinate[];
  public readonly squares: SquareOfBoard[][];
  public readonly isMarkPlaced: Partial<Record<Mark, boolean>> = {};

  constructor(public readonly width: number, public readonly height: number) {
    this.coordinates = Array(width * height)
      .fill(-1)
      .map((_, index) => [Math.floor(index / width), index % height]);

    this.squares = Array.from(Array(width)).map((_, x) =>
      Array.from(Array(height)).map((_, y) => new SquareOfBoard([x, y], this))
    );
  }

  public at([x, y]: Coordinate): SquareOfBoard | null {
    return this.squares[x]?.[y] || null;
  }
}

export default Board;
