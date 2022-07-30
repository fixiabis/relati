import { Piece, PieceSymbol } from '../Piece';
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
    this.movedInTurn = true;
    this.movesRemaining--;
  }

  public toString(): PieceSymbol {
    return this.player.toString();
  }

  public get pieceSymbol(): PieceSymbol {
    return this.player.pieceSymbol;
  }

  public get rootPiece(): Piece | null {
    return this.player.rootPiece;
  }

  public set rootPiece(rootPiece: Piece | null) {
    this.player.rootPiece = rootPiece;
  }
}