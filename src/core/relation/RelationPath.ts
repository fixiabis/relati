import { BoardSquare } from '../board/BoardSquare';
import { Piece } from '../piece/Piece';

export class RelationPath {
  public readonly targetSquare: BoardSquare;
  public readonly otherSquares: readonly BoardSquare[];

  public get blocked(): boolean {
    return this.otherSquares.some((square) => square.piece);
  }

  public get targetPiece(): Piece | null {
    return this.targetSquare.piece;
  }

  constructor(targetSquare: BoardSquare, otherSquares: BoardSquare[]) {
    this.targetSquare = targetSquare;
    this.otherSquares = otherSquares;
  }
}
