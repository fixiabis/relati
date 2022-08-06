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

  public get relatedPieces(): readonly Piece[] {
    return this.availableSquarePaths
      .map((availableSquarePath) => availableSquarePath.endingSquare.piece!)
      .filter(Boolean)
      .filter((maybeSimilarPiece) => maybeSimilarPiece.symbol === this.symbol)
      .filter((similarPiece) => !similarPiece.disabled)
      .filter((piece, index, pieces) => pieces.indexOf(piece) === index); // 可能會對應到同個格子，需要過濾重複的棋子
  }

  private get availableSquarePaths(): readonly BoardSquarePath<Piece>[] {
    const isAvailableSquarePath = (squarePath: BoardSquarePath<Piece>) =>
      squarePath.passingSquares.every((square) => !square.piece);

    return this.squarePaths.filter(isAvailableSquarePath);
  }

  public toString(): string {
    return " " + this.symbol + " ";
  }
}

export type PieceSymbol = typeof Piece.AllSymbols[number];
