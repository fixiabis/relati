import Game, { GameModeName } from './Game';

interface Player<TMode extends GameModeName> {
  onGamePreparedForMove(game: Readonly<Game<TMode>>, prevState: Readonly<Game<TMode>['state']>): void;
}

export default Player;
