import ClassicGame from '../classic/Game';
import SquareOfBoard from '../shared/Board/SquareOfBoard';
import Judge from './Judge';

class Game extends ClassicGame {
  constructor(public readonly numberOfPlayers: number, public readonly judge: Judge) {
    super(numberOfPlayers, judge);
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
      if (square.mark !== ' ') {
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
        const isSenderOfSquare = this.judge.judgeSquareCanBeSender(square, mark);
        square.stateOfMark.isMissingNode = false;

        if (isSenderOfSquare) {
          squaresOfSender.push(square);
        }
      }
    }
  }
}

export default Game;
