import Board from '../Board';
import Direction from '../Direction';
import Game from '../Game';
import Placement from '../moves/Placement';
import Piece from '../Piece';
import { Coordinate } from '../types';
import BaseGameManager from './BaseGameManager';

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

class ClassicGameManager extends BaseGameManager {
  public createGame(numberOfPlayers: number): Game {
    return new Game({
      numberOfPlayers,
      board: new Board({ width: numberOfPlayers * 2 + 1 }),
    });
  }

  protected checkPlacementValidAfterFirstMove(game: Readonly<Game>, move: Placement): boolean {
    const [x, y] = move.coordinate;

    const nearbyCoordinates = nearbyDirections
      .map(([dx, dy]) => [x + dx, y + dy] as Coordinate)
      .filter(game.board.hasCoordinate.bind(game.board));

    const nearbyPieces = nearbyCoordinates
      .map(([x, y]) => game.board.pieces[x]![y])
      .filter((piece): piece is Piece => piece !== null);

    return nearbyPieces.some((piece) => piece.player === move.player);
  }
}

export default ClassicGameManager;
