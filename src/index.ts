import * as process from "node:process";
import * as readline from "node:readline";
import { ConsolePlayer, Game, Mark } from "./v0";

const readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });

const marks = [Mark.O, Mark.X];

const players = marks.map((mark) => ConsolePlayer.create(mark, readlineInterface));

const game = Game.create(players);

game.execute().then(printGameResult);

function printGameResult() {
  readlineInterface.write("遊戲結束！" + (game.winner ? `玩家 ${game.winner.mark} 勝利！` : "沒有贏家") + "\n");
  readlineInterface.close();
}
