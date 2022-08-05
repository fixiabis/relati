import { BoardSquare } from "../core/BoardSquare";
import { Piece, PieceSymbol } from "../core/Piece";
import { RelationPath } from "../core/RelationPath";

export interface ModernPieceInit {
  relationPaths?: RelationPath<ModernPiece>[];
  isRoot?: boolean;
  disabled?: boolean;
}

export class ModernPiece extends Piece {
  public readonly relationPaths: RelationPath<ModernPiece>[];
  public readonly isRoot: boolean;
  public disabled: boolean;

  constructor(symbol: PieceSymbol, square: BoardSquare<ModernPiece>, init: ModernPieceInit = {}) {
    super(symbol, square);
    this.relationPaths = init.relationPaths || [];
    this.isRoot = init.isRoot || false;
    this.disabled = init.disabled || false;
  }

  public get relatedPieces(): readonly ModernPiece[] {
    return this.relationPaths
      .filter((relationPath) => !relationPath.blocked)
      .map((relationPath) => relationPath.targetPiece)
      .filter((piece): piece is ModernPiece => (piece?.symbol === this.symbol) as boolean)
      .filter((piece, index, pieces) => pieces.indexOf(piece) === index); // 多個路徑可以對應到同個位置，需要過濾重複;
  }

  public override toString(): string {
    if (this.isRoot) {
      return `[${this.symbol}]`;
    }

    if (this.disabled) {
      return `-${this.symbol}-`;
    }

    return super.toString();
  }
}
