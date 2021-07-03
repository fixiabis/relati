import ClassicPlayer from '../classic/Player';
import SquareOfBoard from '../shared/Board/SquareOfBoard';

class Player extends ClassicPlayer {
  public makeMarkRoot(square: SquareOfBoard) {
    square.stateOfMark.isRoot = true;
    square.board.stateOfMarks[this.mark].squareOfRoot = square;
  }
}

export default Player;
