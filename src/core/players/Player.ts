import { Piece, PieceSymbol } from '../Piece';

export class Player {
  public readonly pieceSymbol: PieceSymbol;
  public rootPiece: Piece | null;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
    this.rootPiece = null;
  }

  public toString(): PieceSymbol {
    return this.pieceSymbol;
  }
}
