import { Board } from "./board";
import { Game } from "./game";
import { Move } from "./move";
import { Player } from "./player";

export class Turn {
  public game!: Game;
  public readonly player: Player;
  public moves: readonly Move[];

  constructor(player: Player, moves: Move[]) {
    this.player = player;
    this.moves = moves;
  }

  public async execute(): Promise<void> {
    await this.player.takeTurn(this);
  }

  public makeMove(move: Move): void {
    this.game.makeMove(move);
    this.moves = [...this.moves, move];
  }

  public static create(player: Player, moves: Move[] = []): Turn {
    return new Turn(player, moves);
  }
}
