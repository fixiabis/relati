import ModernPlayer from '../modern/Player';
import SquareOfBoard from '../shared/Board/SquareOfBoard';

class Player extends ModernPlayer {
  public actionsRemaining: number = 0;
  public selectedSquare: SquareOfBoard | null = null;
}

export default Player;
