import { Coordinate } from '../../../lib/core/types';
import Direction from '../../core/Direction';
import Game from '../../core/Game';
import ModernGameState from '../../core/game-states/ModernGameState';
import GameMove from '../../core/GameMove';
import * as utils from '../../core/utils';
import AI from './AI';

const nearbyDirections = [
  Direction.F,
  Direction.B,
  Direction.L,
  Direction.R,
  Direction.FL,
  Direction.FR,
  Direction.BL,
  Direction.BR,
];

type Decision = { score: number; move: GameMove };

class TypeAlpha extends AI<'modern' | 'classic'> {
  protected async decideMove(game: Readonly<Game<'modern' | 'classic'>>): Promise<GameMove> {
    const player = this.player;
    const mode = game.mode;
    const state = game.state as ModernGameState;
    const decisions = [] as Decision[];

    for (let x = 0; x < state.board.width; x++) {
      for (let y = 0; y < state.board.height; y++) {
        const coordinate = [x, y] as Coordinate;
        const move = { player, coordinate };
        const moveValid = mode.checkMove(move, state);

        if (moveValid) {
          const score = await this.evaluateScoreOfMove(game, move);
          decisions.push({ move, score });
        }
      }
    }

    const highPointDecisions = decisions.filter((decision) =>
      decisions.every((otherDecision) => decision.score >= otherDecision.score)
    );

    return highPointDecisions[0]!.move;
  }

  protected async evaluateScoreOfMove(game: Readonly<Game<'modern' | 'classic'>>, move: GameMove): Promise<number> {
    const state = { ...game.state };
    await game.mode.takeMove(move, state);
    const scores = this.evaluateScoresForEachPlayer(state);
    return scores[this.player]!;
  }

  protected evaluateScoresForEachPlayer(state: Readonly<Game<'modern' | 'classic'>['state']>): number[] {
    const players = Array.from({ length: state.numberOfPlayers }).map((_, player) => player);
    const turnsTaken = players.map(() => state.board.pieces.map((pieces) => pieces.map(() => -1)));
    const scoresForEachSquare = players.map(() => state.board.pieces.map((pieces) => pieces.map(() => 0)));
    const scores = players.map(() => 0);
    const checkedSquares = [] as number[];

    for (let x = 0; x < state.board.width; x++) {
      for (let y = 0; y < state.board.height; y++) {
        if (state.board.pieces[x]![y] !== null) {
          const piece = state.board.pieces[x]![y]!;
          turnsTaken[piece.player]![x]![y] = 0;
          checkedSquares.push(utils.convertCoordinateToIndex([x, y]));
        }
      }
    }

    for (const square of checkedSquares) {
      const [x, y] = utils.convertIndexToCoordinate(square);

      const nearbyCoordinatesOfEmpty = nearbyDirections
        .map(([dx, dy]) => [x + dx, y + dy] as Coordinate)
        .filter(state.board.hasCoordinate.bind(state.board))
        .filter(([x, y]) => state.board.pieces[x]![y] === null);

      for (let player = 0; player < state.numberOfPlayers; player++) {
        if (turnsTaken[player]![x]![y]! !== -1 && !state.board.pieces[x]![y]?.disabled) {
          const score = turnsTaken[player]![x]![y]!;

          for (const coordinate of nearbyCoordinatesOfEmpty) {
            const square = utils.convertCoordinateToIndex(coordinate);

            if (!checkedSquares.includes(square)) {
              const [x, y] = coordinate;
              turnsTaken[player]![x]![y]! = score + 1;
              checkedSquares.push(square);
            }
          }
        }
      }
    }

    for (let player = 0; player < state.numberOfPlayers; player++) {
      for (let x = 0; x < state.board.width; x++) {
        for (let y = 0; y < state.board.height; y++) {
          if (turnsTaken[player]![x]![y]! > 0) {
            scoresForEachSquare[player]![x]![y] = Math.floor(100 / turnsTaken[player]![x]![y]!);
          }

          for (let otherPlayer = 0; otherPlayer < state.numberOfPlayers; otherPlayer++) {
            if (otherPlayer !== player && turnsTaken[otherPlayer]![x]![y]! > 0) {
              scoresForEachSquare[player]![x]![y] -= Math.floor(100 / turnsTaken[otherPlayer]![x]![y]!);
            }
          }
        }
      }
    }

    for (let player = 0; player < state.numberOfPlayers; player++) {
      for (let x = 0; x < state.board.width; x++) {
        for (let y = 0; y < state.board.height; y++) {
          scores[player]! += scoresForEachSquare[player]![x]![y]!;
        }
      }
    }

    return scores;
  }
}

export default TypeAlpha;
