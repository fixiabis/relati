import { BoardSquare } from '../board/BoardSquare';
import { RelationPath } from '../relation/RelationPath';

export interface PieceInit {
  isRoot?: boolean;
  disabled?: boolean;
  relationPaths?: RelationPath[];
}

export type PieceSymbol = typeof Piece.AllSymbols[number];

export class Piece {
  public static readonly AllSymbols = ['O', 'X', 'D', 'R', 'A', 'H'] as const;

  public readonly symbol: PieceSymbol;
  public readonly square: BoardSquare;
  public readonly isRoot: boolean;
  public readonly relationPaths: readonly RelationPath[];
  public disabled: boolean;

  public get relatedPieces(): readonly Piece[] {
    return this.relationPaths
      .filter((relationPath) => !relationPath.blocked && relationPath.targetPiece?.symbol === this.symbol)
      .map((relationPath) => relationPath.targetPiece!)
      .filter((piece, index, pieces) => pieces.indexOf(piece) === index);
  }

  constructor(symbol: PieceSymbol, square: BoardSquare, init: PieceInit = {}) {
    this.symbol = symbol;
    this.square = square;
    this.isRoot = init.isRoot || false;
    this.disabled = init.disabled || false;
    this.relationPaths = init.relationPaths || [];
  }
}
