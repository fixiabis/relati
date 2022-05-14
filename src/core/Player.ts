import Game, { GameModeName } from './Game';

interface Player<TMode extends GameModeName> {
  onTurned(game: Game<TMode>): void;
}

export default Player;
