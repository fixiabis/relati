import Game, { GameModeName } from './Game';

interface Player<TMode extends GameModeName> {
  onGamePreparedForMove(game: Game<TMode>, prevState: Game<TMode>['state']): void;
}

export default Player;
