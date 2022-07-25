import { PieceSymbol } from './Piece';

export class Player {
  public readonly pieceSymbol: PieceSymbol;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
  }
}
