import ClassicPlayer from '../classic/Player';
import Board from './Board';
import Placement from './interfaces/Placement';

class Player extends ClassicPlayer {
  public takePlacement(board: Board, coordinate: Coordinate): Placement {
    return super.takePlacement(board, coordinate) as Placement;
  }
}

export default Player;
