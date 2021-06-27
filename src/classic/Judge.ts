import { DIRECTIONS } from '../shared/constants/directional';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';
import Player from './Player';

class Judge {
  public calcBoardSize(numberOfPlayers: number): number {
    return numberOfPlayers * 2 + 1;
  }

  public getSquaresOfBoard(board: Board): SquareOfBoard[] {
    return board.coordinates.map(([x, y]) => board.squares[x][y]);
  }

  public getSquaresOfDirection(square: SquareOfBoard): SquareOfBoard[] {
    return DIRECTIONS.map((coordinate) => square.to(coordinate)).filter(
      (square): square is SquareOfBoard => square !== null
    );
  }

  public judgeSquareCanLink(square: SquareOfBoard, mark: Mark): boolean {
    const squares = this.getSquaresOfDirection(square);
    return squares.some((square) => square.mark === mark);
  }

  public judgeSquareCanBePlace(square: SquareOfBoard, mark: Mark): boolean {
    if (square.mark !== ' ') {
      return false;
    }

    return !square.board.marks[mark].isPlaced || this.judgeSquareCanLink(square, mark);
  }

  public judgePlayerCanPlace(player: Player, board: Board): boolean {
    const squares = this.getSquaresOfBoard(board);
    return squares.some((square) => this.judgeSquareCanBePlace(square, player.mark));
  }
}

export default Judge;
