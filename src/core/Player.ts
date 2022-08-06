import { PieceSymbol } from "./Piece";

export interface PlayerInit {
  defeated?: boolean;
}

export class Player {
  public readonly pieceSymbol: PieceSymbol;
  public defeated: boolean;

  constructor(pieceSymbol: PieceSymbol, init: PlayerInit = {}) {
    this.pieceSymbol = pieceSymbol;
    this.defeated = init.defeated || false;
  }

  public toString(): PieceSymbol {
    return this.pieceSymbol;
  }
}
