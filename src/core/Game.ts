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

export interface GameOptions<TMode extends GameModeName = 'modern'> {
  mode?: TMode;
  state?: Partial<GameState<TMode>>;
  players?: (Player<TMode> | undefined)[];
}

class Game<TMode extends GameModeName = 'modern'> {
  public readonly mode: GameMode<TMode>;
  public readonly state: GameState<TMode>;
  public readonly players: (Player<TMode> | undefined)[];

  constructor(options: GameOptions<TMode> = {}) {
    const mode = options.mode || 'modern';
    const state = options.state || {};
    const players = options.players || [];
    const GameState = stateConstructors[mode];

    this.mode = modes[mode];
    this.state = new GameState(state) as GameState<TMode>;
    this.players = players;

    if (this.state.numberOfPlayers !== this.players.length) {
      throw new Error('number of players not matching');
    }

    this.mode.prepare(this.state);
    this.notifyPlayersOnPreparedForMove(this.state);
  }

  protected notifyPlayersOnPreparedForMove(state: GameState<TMode>): void {
    for (const player of this.players) {
      player?.onGamePreparedForMove(this, state);
    }
  }

  public async takeMove(move: GameMove): Promise<void> {
    const prevState = { ...this.state };
    await this.mode.takeMove(move, this.state as ModernGameState);
    this.notifyPlayersOnPreparedForMove(prevState);
  }

  public setPlayer(n: number, player: Player<TMode>): void {
    this.players[n] = player;
    player?.onGamePreparedForMove(this, this.state);
  }

  public removePlayer(n: number): void {
    delete this.players[n];
  }
}

export default Game;
