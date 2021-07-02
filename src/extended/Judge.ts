import ModernJudge from '../modern/Judge';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';

class Judge extends ModernJudge {
  public getSquaresOfRoot(board: Board): SquareOfBoard[] {
    return super.getSquaresOfRoot(board).filter((square) => !square.stateOfMark.isDead);
  }

  public judgeSquareCanBeSender(square: SquareOfBoard, mark: Mark): boolean {
    return (
      super.judgeSquareCanBeSender(square, mark) &&
      !square.stateOfMark.isDead &&
      !square.stateOfMark.isCannon
    );
  }

  public judgeSquareCanBeReceiver(square: SquareOfBoard, mark: Mark): boolean {
    return super.judgeSquareCanBeReceiver(square, mark) && !square.stateOfMark.isDead;
  }

  public judgeSquareIsUnBlocked(square: SquareOfBoard): boolean {
    return super.judgeSquareIsUnBlocked(square) || square.stateOfMark.isDead;
  }

  public countUnlinkedNumberOfEachMark(board: Board): Record<Mark, number> {
    const marks = Object.keys(board.marks) as Mark[];
    const unlinkedNumbers = {} as Record<Mark, number>;
    const squares = this.getSquares(board);

    for (const mark of marks) {
      unlinkedNumbers[mark] = 0;
    }

    for (const square of squares) {
      if (square.mark !== ' ' && square.stateOfMark.isUnlinked && !square.stateOfMark.isDead) {
        unlinkedNumbers[square.mark]++;
      }
    }

    return unlinkedNumbers;
  }

  public judgeSquareIsNormal(square: SquareOfBoard): boolean {
    return (
      !square.stateOfMark.isRoot &&
      !square.stateOfMark.isUnlinked &&
      !square.stateOfMark.isCannon &&
      !square.stateOfMark.isDead
    );
  }

  public judgeSquareOfCannonCanBeAttacker(square: SquareOfBoard, mark: string): boolean {
    return (
      square.mark === mark &&
      square.stateOfMark.isCannon &&
      !square.stateOfMark.isExhaustedCannon &&
      !square.stateOfMark.isDead
    );
  }

  public judgeSquareCanAttackWithCannon(
    square: SquareOfBoard,
    squareOfAttacker: SquareOfBoard
  ): boolean {
    const isSquaresSameX = squareOfAttacker.x === square.x;
    const isSquaresSameY = squareOfAttacker.y === square.y;

    if (!isSquaresSameX && !isSquaresSameY) {
      return false;
    }

    const otherSquares = this.getSquaresInTwoSquares(square, squareOfAttacker);

    return (
      this.judgeSquareCanBeAttackTarget(square, squareOfAttacker.mark as Mark) &&
      this.judgeSquaresOfPathUnblocked(otherSquares)
    );
  }

  public judgeSquareCanComboAttackWithCannon(
    square: SquareOfBoard,
    squareOfAttacker: SquareOfBoard
  ): boolean {
    const isSquaresSameX = squareOfAttacker.x === square.x;
    const isSquaresSameY = squareOfAttacker.y === square.y;

    if (!isSquaresSameX && !isSquaresSameY) {
      return false;
    }

    const otherSquares = this.getSquaresInTwoSquares(square, squareOfAttacker);

    return (
      this.judgeSquareOfCannonCanBeAttacker(square, squareOfAttacker.mark as Mark) &&
      this.judgeSquaresOfPathUnblocked(otherSquares)
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

  public judgeSquareCanBeAttackTarget(square: SquareOfBoard, mark: Mark): boolean {
    return square.mark !== mark && !square.stateOfMark.isDead;
  }

  public judgeSquareIsRoot(square: SquareOfBoard): boolean {
    return square.stateOfMark.isRoot && !square.stateOfMark.isDead;
  }

  public judgeSquareCanMoveRoot(square: SquareOfBoard, squareOfRoot: SquareOfBoard): boolean {
    const isSquareOfNormal = this.judgeSquareIsNormal(square);

    if (!isSquareOfNormal) {
      return false;
    }

    const squaresOfPaths = this.getSquaresByPaths(square);

    const squaresOfSender = this.findSquaresOfPathCanSend(squaresOfPaths, square.mark as Mark).map(
      ([square]) => square
    );

    return squaresOfSender.includes(squareOfRoot);
  }
}

export default Judge;
