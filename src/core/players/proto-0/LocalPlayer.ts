import { AbsoluteCoordinate } from '../../coordinates';
import { PieceSymbol } from '../../piece';
import { Player } from './Player';
import { Game, HyperModernGame } from '../../games/proto-0';

export class LocalPlayer extends Player {
  private activeGame: Game | null;

  constructor(pieceSymbol: PieceSymbol) {
    super(pieceSymbol);
    this.activeGame = null;
  }

  public takeTurn(game: Game): void {
    this.activeGame = game;
  }

  public placePiece(coordinate: AbsoluteCoordinate): void {
    this.onTurnStart();
    this.activeGame!.placePiece(this, coordinate);
    this.onTurnEnd();
  }

  public abandonRemainingMoves(): void {
    this.onTurnStart();

    if (!(this.activeGame instanceof HyperModernGame)) {
      throw new Error('目前的遊戲不是精通模式');
    }

    this.activeGame.abandonRemainingMoves(this);
    this.onTurnEnd();
  }

  private onTurnStart(): void | never {
    if (!this.activeGame) {
      throw new Error('目前沒有遊戲可以動作');
    }
  }

  private onTurnEnd(): void {
    this.activeGame = null;
  }
}
