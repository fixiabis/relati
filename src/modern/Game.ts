import ClassicGame from '../classic/Game';
import { MARKS } from '../shared/constants/marks';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';
import Judge from './Judge';
import Player from './Player';
import GameOptions, { ClassicGameOptions, ModernGameOptions } from './GameOptions';

class Game extends ClassicGame {
  public readonly currentPlayer!: Player;
  public readonly judge!: Judge;
  public readonly players!: Player[];

  static create(numberOfPlayers: number): Game;
  static create(numberOfPlayers: number, options: ModernGameOptions): Game;
  static create(numberOfPlayers: number, options: ClassicGameOptions): ClassicGame;
  static create(numberOfPlayers: number, options?: GameOptions): ClassicGame | Game {
    if (options?.linkMode === 'classic') {
      return super.create(numberOfPlayers);
    }

    const marks = MARKS.slice(0, numberOfPlayers);
    const judge = new Judge();
    const players = marks.map((mark) => new Player(mark));
    const size = numberOfPlayers * 4 + 1;
    const board = new Board(size, size);

    for (const mark of marks) {
      board.marks[mark] = {};
    }

    return new this(players, board, judge);
  }

  public handleSquarePlace(square: SquareOfBoard): void {
    const isAnyMarkPlaced = square.board.marks[this.currentPlayer.mark].isPlaced;

    super.handleSquarePlace(square);

    if (!isAnyMarkPlaced) {
      this.currentPlayer.makeMarkRoot(square);
    }
  }

  public handleSquarePlaced(square: SquareOfBoard) {
    this.updateStateOfMarks(square.board);
    super.handleSquarePlaced(square);
  }

  public updateStateOfMarks(board: Board) {
    const squaresOfSender = this.judge.getSquaresOfRoot(board);

    const squaresMayBeUnlinked = this.judge
      .getSquares(board)
      .filter((square) => square.mark !== ' ' && !square.stateOfMark.isRoot);

    for (const square of squaresMayBeUnlinked) {
      square.stateOfMark.isUnlinked = true;
    }

    for (const square of squaresOfSender) {
      const mark = square.mark as Mark;
      const squaresOfPath = this.judge.getSquaresByPaths(square);

      const squaresOfReceiver = this.judge
        .findSquaresOfPathCanReceive(squaresOfPath, mark)
        .map(([square]) => square)
        .filter((square) => square.stateOfMark.isUnlinked);

      for (const square of squaresOfReceiver) {
        square.stateOfMark.isUnlinked = false;

        const isSquareOfSender = this.judge.judgeSquareCanBeSender(square, mark);

        if (isSquareOfSender) {
          squaresOfSender.push(square);
        }
      }
    }
  }
}

export default Game;
