import ClassicGame from '../classic/Game';
import Board from './Board';
import Judge from './Judge';
import Player from './Player';
import Placement from './interfaces/Placement';

class Game extends ClassicGame {
  constructor(
    public readonly board: Board,
    public readonly players: Player[],
    public readonly judge: Judge
  ) {
    super(board, players, judge);
  }

  static calcBoardSize(numberOfPlayers: number): number {
    return numberOfPlayers * 4 + 1;
  }

  protected handleAfterPlacement(placement: Placement): void {
    const { coordinate, mark } = placement;
    const isRootMark = !(mark in this.board.rootCoordinates);

    if (isRootMark) {
      const [x, y] = coordinate;
      this.board.extraMarks[x][y].isRoot = true;
      this.board.rootCoordinates[mark] = coordinate;
      return;
    }

    this.judge.updateBoardExtraMarks(this.board);
  }
}

export default Game;
