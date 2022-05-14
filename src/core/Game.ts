import ClassicGameMode from './game-modes/ClassicGameMode';
import ModernGameMode from './game-modes/ModernGameMode';
import ClassicGameState from './game-states/ClassicGameState';
import GameState from './game-states/GameState';
import ModernGameState from './game-states/ModernGameState';
import GameMove from './GameMove';

const modes = {
  classic: new ClassicGameMode(),
  modern: new ModernGameMode(),
};

export type GameModeName = keyof typeof modes;

class Game {
  public readonly mode: GameModeName;
  public readonly state: GameState;

  constructor(mode: GameModeName = 'modern', state: Partial<GameState> = {}) {
    this.mode = mode;
    this.state = mode === 'classic' ? new ClassicGameState(state) : new ModernGameState(state);
  }

  public takeMove(move: GameMove) {
    modes[this.mode].takeMove(move, this.state);
  }
}

export default Game;
