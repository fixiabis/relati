import { PieceSymbol } from '../piece/Piece';
import { Player } from './Player';

export class ActivePlayer implements Player {
  private player: Player;
  public movesRemaining: number;
  public movedInTurn: boolean;

  constructor(player: Player) {
    this.player = player;
    this.movesRemaining = 1;
    this.movedInTurn = false;
  }

  public turnTo(player: Player): void {
    this.player = player;
    this.movesRemaining = 1;
    this.movedInTurn = false;
  }

  public endMove(): void {
    this.movesRemaining--;
    this.movedInTurn = true;
  }

  public toString(): PieceSymbol {
    return this.player.toString();
  }

  public get pieceSymbol(): PieceSymbol {
    return this.player.pieceSymbol;
  }
}
