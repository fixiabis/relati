import { BoardSquare } from '../core/board/BoardSquare';
import { Piece, PieceSymbol } from '../core/Piece';
import { RelationPath } from './relation/RelationPath';

export interface ModernPieceInit {
  isRoot?: boolean;
  disabled?: boolean;
  relationPaths?: RelationPath[];
}

export class ModernPiece extends Piece {
  public readonly isRoot: boolean;
  public readonly relationPaths: readonly RelationPath[];
  public disabled: boolean;

  public get relatedPieces(): readonly ModernPiece[] {
    return this.relationPaths
      .filter((relationPath) => !relationPath.blocked && relationPath.targetPiece?.symbol === this.symbol)
      .map((relationPath) => relationPath.targetPiece!)
      .filter((piece, index, pieces) => pieces.indexOf(piece) === index);
  }

  constructor(symbol: PieceSymbol, square: BoardSquare<ModernPiece>, init: ModernPieceInit = {}) {
    super(symbol, square);
    this.isRoot = init.isRoot || false;
    this.disabled = init.disabled || false;
    this.relationPaths = init.relationPaths || [];
  }
}
