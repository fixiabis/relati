import { PieceSymbol } from "./piece/Piece";

export interface PlayerInit {
  abstained?: boolean;
  eliminated?: boolean;
}

export class Player {
  public readonly pieceSymbol: PieceSymbol;
  public abstained: boolean;
  public eliminated: boolean;

  constructor(pieceSymbol: PieceSymbol, init: PlayerInit = {}) {
    this.pieceSymbol = pieceSymbol;
    this.abstained = init.abstained || false;
    this.eliminated = init.eliminated || false;
  }
}
