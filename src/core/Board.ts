import { Position } from "./Position";
import { Vector } from "./Vector";
import { BoardSquare } from "./BoardSquare";

export class Board<TPiece extends {}> {
  public readonly width: number;
  public readonly height: number;
  public readonly squares: readonly BoardSquare<TPiece>[];

  constructor(width: number, height: number = width) {
    this.width = width;
    this.height = height;

    this.squares = Array(this.width * this.height)
      .fill(null)
      .map<Vector>((_, index) => [index % this.width, Math.floor(index / this.width)])
      .map(([x, y]) => new BoardSquare<TPiece>(new Position(x, y), this));
  }

  public squareAt(position: Vector): BoardSquare<TPiece> {
    const [x, y] = position;
    const squareIndex = x * this.width + y;
    return this.squares[squareIndex]!;
  }

  public squareDefinedAt(position: Vector): boolean {
    const [x, y] = position;
    return x > -1 && y > -1 && x < this.width && y < this.height;
  }

  public toString(): string {
    return Array<null[]>(this.height)
      .fill(Array(this.width).fill(null))
      .map((squares, y) => squares.map((_, x) => this.squareAt([x, y])).join("|"))
      .join("\n");
  }

  public get pieces(): readonly TPiece[] {
    return this.squares.map((square) => square.piece!).filter(Boolean);
  }
}
