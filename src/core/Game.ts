import ClassicGameMode from './game-modes/ClassicGameMode';
import ModernGameMode from './game-modes/ModernGameMode';
import ClassicGameState from './game-states/ClassicGameState';
import ModernGameState from './game-states/ModernGameState';
import GameMove from './GameMove';

const modes = {
  classic: new ClassicGameMode(),
  modern: new ModernGameMode(),
};

export type GameModeName = keyof typeof modes;

type GameMode<TModeName extends GameModeName> = {
  classic: ClassicGameMode;
  modern: ModernGameMode;
}[TModeName];

type GameState<TModeName extends GameModeName> = {
  classic: ClassicGameState;
  modern: ModernGameMode;
}[TModeName];

class Game<TModeName extends GameModeName> {
  public readonly mode: GameMode<TModeName>;
  public readonly state: GameState<TModeName>;

  constructor(mode: TModeName = 'modern' as TModeName, state: Partial<GameState<TModeName>> = {}) {
    this.mode = modes[mode];

    this.state = (
      mode === 'classic' ? new ClassicGameState(state) : new ModernGameState(state)
    ) as GameState<TModeName>;
  }

  public takeMove(move: GameMove) {
    this.mode.takeMove(move, this.state as ModernGameState);
  }
}

export default Game;
