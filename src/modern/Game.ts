import ClassicGame from '../classic/Game';
import Player from '../classic/Player';
import { MARKS } from '../shared/constants/marks';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';
import Judge from './Judge';

class Game extends ClassicGame {
  public readonly judge!: Judge;

  static create(numberOfPlayers: number) {
    const judge = new Judge();
    const players = MARKS.slice(0, numberOfPlayers).map((mark) => new Player(mark));
    const size = numberOfPlayers * 4 + 1;
    const board = new Board(size, size);
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

  public handleAfterCurrentPlayerPlaceMark() {
    this.updateStateOfMarkOfSquares();
    super.handleAfterCurrentPlayerPlaceMark();
  }

  public updateStateOfMarkOfSquares() {
    const squaresOfSender = this.judge.getSquaresOfRoot(this.marks, this.board);

    const squaresMayBeMissingNode = this.judge
      .getSquaresOfBoard(this.board)
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
