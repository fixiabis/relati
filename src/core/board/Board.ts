import { Piece } from '../Piece';
import { Position } from '../vectors/Position';
import { Vector } from '../vectors/Vector';
import { BoardSquare } from './BoardSquare';

export class Board {
  public readonly width: number;
  public readonly height: number;
  public readonly squares: readonly (readonly BoardSquare[])[];
  public readonly squareList: readonly BoardSquare[];

  constructor(width: number, height: number = width) {
    if (width < 0 || height < 0) {
      throw new Error(`棋盤大小異常，拿到了: ${width}, ${height}`);
    }

    this.width = width;
    this.height = height;

    this.squares = Array<null[]>(this.width)
      .fill(Array(this.height).fill(null))
      .map((squares, x) => squares.map((_, y) => new BoardSquare(new Position(x, y), this)));

    this.squareList = Array(this.width * this.height)
      .fill(null)
      .map<Vector>((_, index) => [index % this.width, Math.floor(index / this.width)])
      .map(([x, y]) => this.squares[x]![y]!);
  }

  public squareDefinedAt(position: Vector): boolean {
    const [x, y] = position;
    return x > -1 && y > -1 && x < this.width && y < this.height;
  }

  public squareAt(position: Vector): BoardSquare {
    if (!this.squareDefinedAt(position)) {
      throw new Error(`格子未定義在: ${Position.stringify(position)}`);
    }

    const [x, y] = position;
    return this.squares[x]![y]!;
  }

  public get pieces(): readonly Piece[] {
    return this.squareList.map((square) => square.piece!).filter(Boolean);
  }
}
