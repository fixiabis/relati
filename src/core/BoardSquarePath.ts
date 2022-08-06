import { BoardSquare } from "./BoardSquare";

export class BoardSquarePath<TPiece> {
  public readonly endingSquare: BoardSquare<TPiece>;
  public readonly passingSquare: readonly BoardSquare<TPiece>[];

  constructor(endingSquare: BoardSquare<TPiece>, passingSquare: BoardSquare<TPiece>[]) {
    this.endingSquare = endingSquare;
    this.passingSquare = passingSquare;
  }
}
