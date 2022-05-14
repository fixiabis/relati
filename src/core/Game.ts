import ClassicGameMode from './game-modes/ClassicGameMode';
import ModernGameMode from './game-modes/ModernGameMode';
import ClassicGameState from './game-states/ClassicGameState';
import ModernGameState from './game-states/ModernGameState';
import GameMove from './GameMove';
import Player from './Player';

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

class Game<TMode extends GameModeName = 'modern'> {
  public readonly players: readonly Player<TMode>[];
  public readonly mode: GameMode<TMode>;
  public readonly state: GameState<TMode>;

  constructor(players: Player<TMode>[], mode = 'modern' as TMode, state: Partial<GameState<TMode>> = {}) {
    const GameState = stateConstructors[mode];

    this.players = players;
    this.mode = modes[mode];
    this.state = new GameState(state) as GameState<TMode>;

    if (state.numberOfPlayers !== players.length) {
      throw new Error('number of players not matching');
    }

    this.players[this.state.currentPlayer]!.onTurned(this);
  }

  public takeMove(move: GameMove) {
    this.mode.takeMove(move, this.state as ModernGameState);
    this.players[this.state.currentPlayer]!.onTurned(this);
  }
}

export default Game;
