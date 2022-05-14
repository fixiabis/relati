import Game, { GameModeName } from './Game';

interface Player<TMode extends GameModeName> {
  onCanMove?(game: Game<TMode>): void;
  onPlayersEliminated?(game: Game<TMode>, eliminatedPlayers: readonly number[]): void;
  onGameEnded?(game: Game<TMode>): void;
}

export default Player;
