import { PieceSymbol } from '../piece/Piece';

export abstract class Player {
  public readonly pieceSymbol: PieceSymbol;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
  }
}
