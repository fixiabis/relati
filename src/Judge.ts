import { DIRECTIONS } from './constants';
import Board from './Board/Board';
import SquareOfBoard from './Board/SquareOfBoard';
import Player from './Player';

class Judge {
  public calcBoardSize(numberOfPlayers: number): number {
    return numberOfPlayers * 2 + 1;
  }

  public judgeSquareCanLink(square: SquareOfBoard, mark: Mark): boolean {
    const squares = DIRECTIONS.map((coordinate) => square.to(coordinate)).filter(
      (square): square is SquareOfBoard => square !== null
    );

    return squares.some((square) => square.mark === mark);
  }

  public judgeSquareCanBePlace(square: SquareOfBoard, mark: Mark): boolean {
    if (square.mark !== ' ') {
      return false;
    }

    return !square.board.marks[mark].isPlaced || this.judgeSquareCanLink(square, mark);
  }

  public judgePlayerCanPlace(player: Player, board: Board): boolean {
    const squares = board.coordinates.map(([x, y]) => board.squares[x][y]);
    return squares.some((square) => this.judgeSquareCanBePlace(square, player.mark));
  }
}

export default Judge;
