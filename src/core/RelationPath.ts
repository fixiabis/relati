import { BoardSquare } from "./BoardSquare";

export class RelationPath<TPiece> {
  public readonly targetSquare: BoardSquare<TPiece>;
  public readonly passedBySquares: readonly BoardSquare<TPiece>[];

  public get blocked(): boolean {
    return this.passedBySquares.some((square) => square.piece);
  }

  public get targetPiece(): TPiece | null {
    return this.targetSquare.piece;
  }

  constructor(targetSquare: BoardSquare<TPiece>, passedBySquares: BoardSquare<TPiece>[]) {
    this.targetSquare = targetSquare;
    this.passedBySquares = passedBySquares;
  }
}
