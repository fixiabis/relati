import type * as readline from "node:readline";
import { Player } from "../player";
import { Position, PositionCode } from "../position";
import { Mark } from "../mark";
import { Turn } from "../turn";

export class ConsolePlayer extends Player {
  private readlineInterface: readline.Interface;

  constructor(mark: Mark, readlineInterface: readline.Interface) {
    super(mark);
    this.readlineInterface = readlineInterface;
  }

  public override async takeTurn(turn: Turn): Promise<void> {
    do {
      try {
        return await super.takeTurn(turn);
      } catch {
        this.readlineInterface.write("該位置無法下棋，請重新選擇\n");
      }
    } while (true);
  }

  protected override async decidePosition(): Promise<Position> {
    this.printBoard();
    this.readlineInterface.write(`現在輪到 ${this.mark}\n`);

    const positionCode = (
      await new Promise<string>((resolve) => this.readlineInterface.question("輸入下棋位置: ", resolve))
    ).toUpperCase() as PositionCode;
    return Position.parse(positionCode);
  }

  private printBoard() {
    this.readlineInterface.write(
      this.game.board.squares
        .map((squares) =>
          squares
            .map((square) => square.piece?.mark || " ")
            .map((mark) => ` ${mark} `)
            .join("|")
        )
        .map((row) => `|${row}|`)
        .join("\n") + "\n"
    );
  }

  public static create(mark: Mark, readlineInterface: readline.Interface) {
    return new ConsolePlayer(mark, readlineInterface);
  }
}
