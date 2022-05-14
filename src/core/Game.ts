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

    this.notifyPlayersOnInitialized();
  }

  protected notifyPlayerWhoCanMove(): void {
    if (!this.state.ended) {
      this.players[this.state.currentPlayer]!.onCanMove?.(this);
    }
  }

  protected notifyPlayersIfHasPlayerEliminated(eliminatedPlayers: readonly number[]): void {
    const hasPlayerEliminated = eliminatedPlayers.length > 0;

    if (hasPlayerEliminated) {
      for (const player of this.players) {
        player.onPlayersEliminated?.(this, eliminatedPlayers);
      }
    }
  }

  protected notifyPlayersIfGameEnded(): void {
    if (this.state.ended) {
      for (const player of this.players) {
        player.onGameEnded?.(this);
      }
    }
  }

  protected notifyPlayersOnInitialized() {
    this.notifyPlayersIfHasPlayerEliminated(this.state.eliminatedPlayers);
    this.notifyPlayersIfGameEnded();
    this.notifyPlayerWhoCanMove();
  }

  public takeMove(move: GameMove): void {
    const prevEliminatedPlayers = this.state.eliminatedPlayers;

    this.mode.takeMove(move, this.state as ModernGameState);

    const currentEliminatedPlayers =
      this.state.eliminatedPlayers !== prevEliminatedPlayers
        ? this.state.eliminatedPlayers.filter((player) => !prevEliminatedPlayers.includes(player))
        : [];

    this.notifyPlayersIfHasPlayerEliminated(currentEliminatedPlayers);
    this.notifyPlayersIfGameEnded();
    this.notifyPlayerWhoCanMove();
  }
}

export default Game;
