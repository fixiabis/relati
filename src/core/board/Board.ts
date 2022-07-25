import { PositionCoordinate } from '../coordinates/PositionCoordinate';
import { Coordinate } from '../coordinates/Coordinate';
import { BoardSquare } from './BoardSquare';

export class Board<Piece> {
  public readonly width: number;
  public readonly height: number;
  public readonly squares: readonly (readonly BoardSquare<Piece>[])[];
  public readonly squareList: readonly BoardSquare<Piece>[];

  constructor(width: number, height: number = width) {
    if (width < 0 || height < 0) {
      throw new Error(`Board size invalid, got width: ${width}, height: ${height}`);
    }

    this.width = width;
    this.height = height;

    this.squares = Array<null[]>(this.width)
      .fill(Array(this.height).fill(null))
      .map((squares, x) => squares.map((_, y) => new BoardSquare<Piece>(new PositionCoordinate(x, y), this)));

    this.squareList = Array(this.width * this.height)
      .fill(null)
      .map<Coordinate>((_, index) => [index % this.width, Math.floor(index / this.width)])
      .map(([x, y]) => this.squares[x]![y]!);
  }

  public squareDefinedAt(position: Coordinate): boolean {
    const [x, y] = position;
    return x > -1 && y > -1 && x < this.width && y < this.height;
  }

  public squareAt(position: Coordinate): BoardSquare<Piece> {
    if (!this.squareDefinedAt(position)) {
      throw new Error(`Square not defined at: ${PositionCoordinate.stringify(position)}`);
    }

    const [x, y] = position;
    return this.squares[x]![y]!;
  }

  public get pieces(): readonly Piece[] {
    return this.squareList.map((square) => square.piece!).filter(Boolean);
  }
}
