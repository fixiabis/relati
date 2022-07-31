import { BoardSquare } from './board/BoardSquare';

export type PieceSymbol = typeof Piece.AllSymbols[number];

export class Piece {
  public static readonly AllSymbols = ['O', 'X', 'D', 'R', 'A', 'H'] as const;

  public readonly symbol: PieceSymbol;
  public readonly square: BoardSquare<Piece>;

  constructor(symbol: PieceSymbol, square: BoardSquare<Piece>) {
    this.symbol = symbol;
    this.square = square;
  }

  public toString(): string {
    return ` ${this.symbol} `;
  }
}
