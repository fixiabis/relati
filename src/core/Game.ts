import ClassicGameMode from './game-modes/ClassicGameMode';
import ModernGameMode from './game-modes/ModernGameMode';
import ClassicGameState from './game-states/ClassicGameState';
import ModernGameState from './game-states/ModernGameState';
import GameMove from './GameMove';

const modes = {
  classic: new ClassicGameMode(),
  modern: new ModernGameMode(),
};

type GameMode<TModeName extends GameModeName> = typeof modes[TModeName];

const stateConstructors = {
  classic: ClassicGameState,
  modern: ModernGameState,
};

type GameState<TModeName extends GameModeName> = typeof stateConstructors[TModeName]['prototype'];

export type GameModeName = keyof typeof modes;

class Game<TModeName extends GameModeName = 'modern'> {
  public readonly mode: GameMode<TModeName>;
  public readonly state: GameState<TModeName>;

  constructor(mode = 'modern' as TModeName, state: Partial<GameState<TModeName>> = {}) {
    const GameState = stateConstructors[mode];
    this.mode = modes[mode];
    this.state = new GameState(state) as GameState<TModeName>;
  }

  public takeMove(move: GameMove) {
    this.mode.takeMove(move, this.state as ModernGameState);
  }
}

export default Game;
