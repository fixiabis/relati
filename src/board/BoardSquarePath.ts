import { BoardSquare } from "./BoardSquare";

export class BoardSquarePath<TPiece extends {}> {
  public readonly startingSquare: BoardSquare<TPiece>;
  public readonly endingSquare: BoardSquare<TPiece>;
  public readonly passingSquares: BoardSquare<TPiece>[];

  constructor(
    startingSquare: BoardSquare<TPiece>,
    endingSquare: BoardSquare<TPiece>,
    passingSquares: BoardSquare<TPiece>[]
  ) {
    this.startingSquare = startingSquare;
    this.endingSquare = endingSquare;
    this.passingSquares = passingSquares;
  }
}
