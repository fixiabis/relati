import { PieceSymbol } from '../piece/Piece';

export class Player {
  public readonly pieceSymbol: PieceSymbol;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
  }

  public toString(): PieceSymbol {
    return this.pieceSymbol;
  }
}
