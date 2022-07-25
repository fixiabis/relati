import { BoardSquare } from '../../core/board/BoardSquare';
import { ModernPiece } from '../Piece';

export class RelationPath {
  public readonly targetSquare: BoardSquare<ModernPiece>;
  public readonly otherSquares: readonly BoardSquare<ModernPiece>[];

  public get blocked(): boolean {
    return this.otherSquares.some((square) => square.piece);
  }

  public get targetPiece(): ModernPiece | null {
    return this.targetSquare.piece;
  }

  constructor(targetSquare: BoardSquare<ModernPiece>, otherSquares: BoardSquare<ModernPiece>[]) {
    this.targetSquare = targetSquare;
    this.otherSquares = otherSquares;
  }
}
