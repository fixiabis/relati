import { Game } from "../game";
import { Move } from "../move";
import { Piece } from "../piece";
import { Player } from "../player";
import { Position } from "../position";

export class PlacePiece extends Move {
  public readonly position: Position;

  constructor(player: Player, position: Position) {
    super(player);
    this.position = position;
  }

  public override execute(game: Game): void {
    const square = game.board.squareAt(this.position);
    const piece = Piece.create(this.player.mark);
    square.placePiece(piece);
  }

  public static isPlacePiece(move: Move): move is PlacePiece {
    return move instanceof PlacePiece;
  }

  public static create(player: Player, position: Position): PlacePiece {
    return new PlacePiece(player, position);
  }
}

PlacePiece.prototype.type = "PlacePiece";

export class InvalidPlacePieceError extends Error {}

InvalidPlacePieceError.prototype.name = "InvalidPlacePieceError";
