import ModernPlayer from '../modern/Player';
import SquareOfBoard from '../shared/Board/SquareOfBoard';

class Player extends ModernPlayer {
  public actionsRemaining: number = 0;
  public cannonRemaining: number = 0;
  public selectedSquare: SquareOfBoard | null = null;

  public makeMarkCannon(square: SquareOfBoard): void {
    square.stateOfMark.isCannon = true;
  }

  public makeMarkExhaustedCannon(square: SquareOfBoard): void {
    square.stateOfMark.isExhaustedCannon = true;
  }

  public makeMarkDead(square: SquareOfBoard): void {
    square.stateOfMark.isDead = true;
  }
}

export default Player;
