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
    const [x, y] = position;
    return this.squares[x]![y]!;
  }

  public get pieces(): readonly Piece[] {
    return this.squareList.map((square) => square.piece!).filter(Boolean);
  }
}
