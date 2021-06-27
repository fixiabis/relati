import ClassicGame from '../classic/Game';
import Player from '../classic/Player';
import { MARKS } from '../shared/constants/marks';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';
import Judge from './Judge';

class Game extends ClassicGame {
  public readonly judge!: Judge;

  static create(numberOfPlayers: number) {
    const marks = MARKS.slice(0, numberOfPlayers);
    const judge = new Judge();
    const players = marks.map((mark) => new Player(mark));
    const size = numberOfPlayers * 4 + 1;
    const board = new Board(size, size);
    marks.forEach((mark) => (board.marks[mark] = {}));
    return new this(players, board, judge);
  }

  public handleSquarePlace(square: SquareOfBoard): void {
    const isAnyMarkPlaced = square.board.marks[this.currentPlayer.mark].isPlaced;

    super.handleSquarePlace(square);

    if (!isAnyMarkPlaced) {
      square.stateOfMark.isRoot = true;
      square.board.marks[this.currentPlayer.mark].squareOfRoot = square;
    }
  }

  public handleAfterSquarePlace(square: SquareOfBoard) {
    this.updateStateOfMarkOfSquares(square.board);
    super.handleAfterSquarePlace(square);
  }

  public updateStateOfMarkOfSquares(board: Board) {
    const squaresOfSender = this.judge.getSquaresOfRoot(board);

    const squaresMayBeMissingNode = this.judge
      .getSquares(board)
      .filter((square) => square.mark !== ' ' && !square.stateOfMark.isRoot);

    for (const square of squaresMayBeMissingNode) {
      square.stateOfMark.isMissingNode = true;
    }

    for (const square of squaresOfSender) {
      const mark = square.mark as Mark;
      const squaresOfPath = this.judge.getSquaresByPaths(square);

      const squaresOfReceiver = this.judge
        .findSquaresOfPathCanReceive(squaresOfPath, mark)
        .map(([square]) => square)
        .filter((square) => square.stateOfMark.isMissingNode);

      for (const square of squaresOfReceiver) {
        square.stateOfMark.isMissingNode = false;

        const isSquareOfSender = this.judge.judgeSquareCanBeSender(square, mark);

        if (isSquareOfSender) {
          squaresOfSender.push(square);
        }
      }
    }
  }
}

export default Game;
