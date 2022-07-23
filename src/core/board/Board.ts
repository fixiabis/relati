import { BoardSquare } from './BoardSquare';
import { Coordinate, AbsoluteCoordinate } from '../coordinates';
import { Piece } from '../piece/Piece';

export class Board {
  public readonly width: number;
  public readonly height: number;
  public readonly squares: readonly (readonly BoardSquare[])[];
  public readonly squareList: readonly BoardSquare[];

  constructor(width: number, height: number = width) {
    if (width < 0 || height < 0) {
      throw new Error(`Invalid board size, got: ${width} x ${height}`);
    }

    this.width = width;
    this.height = height;

    this.squares = Array<null[]>(this.width)
      .fill(Array(this.height).fill(null))
      .map((squares, x) => squares.map((_, y) => new BoardSquare(new AbsoluteCoordinate(x, y), this)));

    this.squareList = Array(this.width * this.height)
      .fill(null)
      .map<Coordinate>((_, index) => [index % this.width, Math.floor(index / this.width)])
      .map(([x, y]) => this.squares[x]![y]!);
  }

  public squareDefinedAt(absoluteCoordinate: Coordinate): boolean {
    const [x, y] = absoluteCoordinate;
    return x > -1 && y > -1 && x < this.width && y < this.height;
  }

  public squareAt(absoluteCoordinate: Coordinate): BoardSquare {
    if (!this.squareDefinedAt(absoluteCoordinate)) {
      throw new Error(`Square not defined at: ${AbsoluteCoordinate.stringify(absoluteCoordinate)}`);
    }

    const [x, y] = absoluteCoordinate;
    return this.squares[x]![y]!;
  }

  public get pieces(): readonly Piece[] {
    return this.squareList.map((square) => square.piece!).filter(Boolean);
  }
}
