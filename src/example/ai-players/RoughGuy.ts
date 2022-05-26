import { Coordinate } from '../../../lib/core/types';
import Game from '../../core-0/Game';
import ModernGameState from '../../core-0/game-states/ModernGameState';
import GameMove from '../../core-0/GameMove';
import AIPlayer from './AIPlayer';

class RoughGuy extends AIPlayer<'classic' | 'modern'> {
  protected decideMove(game: Readonly<Game<'classic' | 'modern'>>): Promise<GameMove> {
    const player = this.player;
    const mode = game.mode;
    const state = game.state as ModernGameState;
    const possibleMoves = [] as GameMove[];

    for (let x = 0; x < state.board.width; x++) {
      for (let y = 0; y < state.board.height; y++) {
        const coordinate = [x, y] as Coordinate;
        const move = { player, coordinate };
        const moveValid = mode.checkMove(move, state);

        if (moveValid) {
          possibleMoves.push(move);
        }
      }
    }

    const casualMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]!;
    return Promise.resolve(casualMove);
  }
}

export default RoughGuy;
