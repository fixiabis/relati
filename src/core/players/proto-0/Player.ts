import { Game } from '../../games/proto-0';
import { PieceSymbol } from '../../piece';

export abstract class Player {
  public pieceSymbol: PieceSymbol;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
  }

  public abstract takeTurn(game: Game): void;
}
