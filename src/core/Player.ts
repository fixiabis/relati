import { PieceSymbol } from './Piece';

export interface PlayerInit {
  movesRemaining?: number;
}

export class Player {
  public readonly pieceSymbol: PieceSymbol;
  public movesRemaining: number;

  constructor(pieceSymbol: PieceSymbol, init: PlayerInit = {}) {
    this.pieceSymbol = pieceSymbol;
    this.movesRemaining = init.movesRemaining || 0;
  }

  public toString(): PieceSymbol {
    return this.pieceSymbol;
  }
}
