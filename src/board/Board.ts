import { BoardException } from "../exceptions/board";
import { Position } from "../positional/Position";
import { Vector2 } from "../positional/Vector2";
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
      .map((_, index) => this.indexToPosition(index))
      .map((position) => this.createSquare(position));
  }

  public indexToPosition(index: number): Position {
    return Position.of([Math.floor(index / this.width), index % this.width]);
  }

  private createSquare(position: Position): BoardSquare<TPiece> {
    return new BoardSquare<TPiece>(position, this);
  }

  public squareAt(position: Vector2): BoardSquare<TPiece> {
    if (!this.squareDefinedAt(position)) {
      throw new BoardException(`Square not defined at ${position}`);
    }

    return this.squareAtDirectly(position);
  }

  public squareDefinedAt(position: Vector2): boolean {
    const [x, y] = position;
    return x > -1 && y > -1 && x < this.width && y < this.height;
  }

  public squareAtDirectly(position: Vector2): BoardSquare<TPiece> {
    return this.squares[this.positionToIndex(position)]!;
  }

  public positionToIndex(position: Vector2): number {
    const [x, y] = position;
    return x * this.width + y;
  }

  public toString(): string {
    return Array<null[]>(this.height)
      .fill(Array(this.width).fill(null))
      .map((squares, y) => squares.map((_, x) => this.squares[x * this.width + y]).join("|"))
      .join("\n");
  }

  public get pieces(): readonly TPiece[] {
    return this.squares.map((square) => square.piece!).filter(Boolean);
  }
}
