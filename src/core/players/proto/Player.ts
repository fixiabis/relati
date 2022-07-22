import { Game } from '../../games';
import { PieceSymbol } from '../../piece';

export abstract class Player {
  public pieceSymbol: PieceSymbol;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
  }

  public abstract takeTurn(game: Game): void;
}
