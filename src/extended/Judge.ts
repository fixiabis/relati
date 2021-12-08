import ModernJudge from '../modern/Judge';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';

class Judge extends ModernJudge {
  public countUnlinkedNumberOfEachMark(board: Board): Record<Mark, number> {
    const marks = Object.keys(board.stateOfMarks) as Mark[];
    const unlinkedNumbers = {} as Record<Mark, number>;
    const squares = this.getSquares(board);

    for (const mark of marks) {
      unlinkedNumbers[mark] = 0;
    }

    for (const square of squares) {
      if (square.mark !== ' ' && square.stateOfMark.isUnlinked) {
        unlinkedNumbers[square.mark]++;
      }
    }

    return unlinkedNumbers;
  }

  public judgeSquareIsNormal(square: SquareOfBoard): boolean {
    return (
      !square.stateOfMark.isRoot &&
      !square.stateOfMark.isUnlinked
    );
  }

  public getSquaresInTwoSquares(
    squareOfStart: SquareOfBoard,
    squareOfEnd: SquareOfBoard
  ): SquareOfBoard[] {
    const board = squareOfStart.board;

    return squareOfEnd.x === squareOfStart.x
      ? squareOfEnd.y > squareOfStart.y
        ? Array(squareOfEnd.y - squareOfStart.y - 1)
            .fill(squareOfEnd.y - 1)
            .map((y, dy) => board.squares[squareOfStart.x][y - dy])
        : Array(squareOfStart.y - squareOfEnd.y - 1)
            .fill(squareOfEnd.y + 1)
            .map((y, dy) => board.squares[squareOfStart.x][y + dy])
      : squareOfEnd.x > squareOfStart.x
      ? Array(squareOfEnd.x - squareOfStart.x - 1)
          .fill(squareOfEnd.x - 1)
          .map((x, dx) => board.squares[x - dx][squareOfStart.y])
      : Array(squareOfStart.x - squareOfEnd.x - 1)
          .fill(squareOfEnd.x + 1)
          .map((x, dx) => board.squares[x + dx][squareOfStart.y]);
  }
}

export default Judge;
