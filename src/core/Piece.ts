import { BoardSquare } from './board/BoardSquare';
import { RelationPath } from './modes/RelationPath';

export type PieceSymbol = typeof Piece.AllSymbols[number];

export interface PieceInit {
  relationPaths?: RelationPath[];
  isRoot?: boolean;
  disabled?: boolean;
  dead?: boolean;
}

export class Piece {
  public static readonly AllSymbols = ['O', 'X', 'D', 'R', 'A', 'H'] as const;

  public readonly symbol: PieceSymbol;
  public readonly square: BoardSquare;
  public readonly relationPaths: RelationPath[];
  public readonly isRoot: boolean;
  public disabled: boolean;
  public dead: boolean;

  constructor(symbol: PieceSymbol, square: BoardSquare, init: PieceInit = {}) {
    this.symbol = symbol;
    this.square = square;
    this.relationPaths = init.relationPaths || [];
    this.isRoot = init.isRoot || false;
    this.disabled = init.disabled || false;
    this.dead = init.dead || false;
  }

  public get relatedPieces(): readonly Piece[] {
    return this.relationPaths
      .filter((relationPath) => !relationPath.blocked && relationPath.targetPiece?.symbol === this.symbol)
      .map((relationPath) => relationPath.targetPiece!)
      .filter((piece, index, pieces) => pieces.indexOf(piece) === index); // 多個路徑可以對應到同個位置，需要過濾重複;
  }

  public toString(): string {
    if (this.dead && this.isRoot) {
      return `=${this.symbol}]`;
    }

    if (this.dead) {
      return `=${this.symbol}=`;
    }

    if (this.isRoot) {
      return `[${this.symbol}]`;
    }

    if (this.disabled) {
      return `-${this.symbol}-`;
    }

    return ` ${this.symbol} `;
  }
}
