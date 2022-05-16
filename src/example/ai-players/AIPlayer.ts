import Game, { GameModeName } from '../../core/Game';
import GameMove from '../../core/GameMove';
import Player from '../../core/Player';

abstract class AIPlayer<TMode extends GameModeName> implements Player<TMode> {
  public readonly player: number;

  constructor(player: number) {
    this.player = player;
  }

  public async onGamePreparedForMove(game: Readonly<Game<TMode>>, prevState: Game<TMode>['state']): Promise<void> {
    const canMove = !game.state.ended && game.state.currentPlayer === this.player;

    if (canMove) {
      const move = await this.decideMove(game, prevState);
      game.takeMove(move);
    }
  }

  protected abstract decideMove(
    game: Readonly<Game<TMode>>,
    prevState: Readonly<Game<TMode>['state']>
  ): Promise<GameMove>;
}

export default AIPlayer;
