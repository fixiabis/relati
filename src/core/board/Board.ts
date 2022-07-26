import { PositionCoordinate } from '../coordinates/PositionCoordinate';
import { Coordinate } from '../coordinates/Coordinate';
import { BoardSquare } from './BoardSquare';

export class Board<TPiece = any> {
  public readonly width: number;
  public readonly height: number;
  public readonly squares: readonly (readonly BoardSquare<TPiece>[])[];
  public readonly squareList: readonly BoardSquare<TPiece>[];

  constructor(width: number, height: number = width) {
    if (width < 0 || height < 0) {
      throw new Error(`棋盤大小異常，拿到了: ${width}, ${height}`);
    }

    this.width = width;
    this.height = height;

    this.squares = Array<null[]>(this.width)
      .fill(Array(this.height).fill(null))
      .map((squares, x) => squares.map((_, y) => new BoardSquare<TPiece>(new PositionCoordinate(x, y), this)));

    this.squareList = Array(this.width * this.height)
      .fill(null)
      .map<Coordinate>((_, index) => [index % this.width, Math.floor(index / this.width)])
      .map(([x, y]) => this.squares[x]![y]!);
  }

  public squareDefinedAt(position: Coordinate): boolean {
    const [x, y] = position;
    return x > -1 && y > -1 && x < this.width && y < this.height;
  }

  public squareAt(position: Coordinate): BoardSquare<TPiece> {
    if (!this.squareDefinedAt(position)) {
      throw new Error(`格子未定義在: ${PositionCoordinate.stringify(position)}`);
    }

    const [x, y] = position;
    return this.squares[x]![y]!;
  }

  public get pieces(): readonly TPiece[] {
    return this.squareList.map((square) => square.piece!).filter(Boolean);
  }
}
