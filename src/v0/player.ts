import { Game } from "./game";
import { Mark } from "./mark";
import { PlacePiece } from "./moves/place-piece";
import { Position } from "./position";
import { Turn } from "./turn";

export abstract class Player {
  public game!: Game;
  public readonly mark: Mark;

  constructor(mark: Mark) {
    this.mark = mark;
  }

  public async takeTurn(turn: Turn): Promise<void> {
    const position = await this.decidePosition();
    const placePiece = PlacePiece.create(this, position);
    turn.makeMove(placePiece);
  }

  protected abstract decidePosition(): Promise<Position>;
}
