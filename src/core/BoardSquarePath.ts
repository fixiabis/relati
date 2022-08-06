import { BoardSquare } from "./BoardSquare";

export class BoardSquarePath<TPiece> {
  public readonly endingSquare: BoardSquare<TPiece>;
  public readonly passingSquares: readonly BoardSquare<TPiece>[];

  constructor(endingSquare: BoardSquare<TPiece>, passingSquares: BoardSquare<TPiece>[]) {
    this.endingSquare = endingSquare;
    this.passingSquares = passingSquares;
  }
}
