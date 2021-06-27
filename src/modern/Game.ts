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
    const squares = this.judge.getSquaresOfBoard(this.board);

    for (const square of squares) {
      if (square.mark !== ' ' && !square.stateOfMark.isRoot) {
        square.stateOfMark.isMissingNode = true;
      }
    }

    for (const square of squaresOfSender) {
      const mark = square.mark as Mark;
      const squaresOfPath = this.judge.getSquaresOfPath(square);

      const squaresOfReceiver = this.judge
        .findSquaresOfPathCanReceive(squaresOfPath, mark)
        .map(([square]) => square)
        .filter((square) => square.stateOfMark.isMissingNode);

      for (const square of squaresOfReceiver) {
        square.stateOfMark.isMissingNode = false;

        const isSenderOfSquare = this.judge.judgeSquareCanBeSender(square, mark);

        if (isSenderOfSquare) {
          squaresOfSender.push(square);
        }
      }
    }
  }
}

export default Game;
