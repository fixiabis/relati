import { BoardSquare } from "./BoardSquare";
import { BoardSquarePath } from "./BoardSquarePath";

export interface PieceInit {
  isRoot?: boolean;
  disabled?: boolean;
  squarePaths?: BoardSquarePath<Piece>[];
}

export class Piece {
  public static readonly AllSymbols = ["O", "X", "D", "R", "A", "H"] as const;

  public readonly symbol: PieceSymbol;
  public readonly square: BoardSquare<Piece>;
  public readonly isRoot: boolean;
  public disabled: boolean;
  public readonly squarePaths: readonly BoardSquarePath<Piece>[];

  constructor(symbol: PieceSymbol, square: BoardSquare<Piece>, init: PieceInit = {}) {
    this.symbol = symbol;
    this.square = square;
    this.isRoot = init.isRoot || false;
    this.disabled = init.disabled || false;
    this.squarePaths = init.squarePaths || [];
  }

  public toString(): string {
    return " " + this.symbol + " ";
  }
}

export type PieceSymbol = typeof Piece.AllSymbols[number];
