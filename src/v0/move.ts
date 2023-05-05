import { Game } from "./game";
import { Player } from "./player";

export abstract class Move {
  public type!: string;
  public readonly player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public abstract execute(game: Game): void;
}

Move.prototype.type = "Move";

export class InvalidMoveError extends Error {}

InvalidMoveError.prototype.name = "InvalidMoveError";
