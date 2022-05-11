import Board from '../Board';
import Direction from '../Direction';
import Battle from '../Battle';
import Placement from '../moves/Placement';
import Piece from '../Piece';
import { Coordinate } from '../types';
import BaseBattleManager from './BaseBattleManager';

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

class ClassicBattleManager extends BaseBattleManager {
  public createBattle(numberOfPlayers: number): Readonly<Battle> {
    return new Battle({
      numberOfPlayers,
      board: new Board({ width: numberOfPlayers * 2 + 1 }),
    });
  }

  protected checkPlacementValidAfterFirstMove(battle: Readonly<Battle>, move: Placement): boolean {
    const [x, y] = move.coordinate;

    const nearbyCoordinates = nearbyDirections
      .map(([dx, dy]) => [x + dx, y + dy] as Coordinate)
      .filter(battle.board.hasCoordinate.bind(battle.board));

    const nearbyPieces = nearbyCoordinates
      .map(([x, y]) => battle.board.pieces[x]![y])
      .filter((piece): piece is Piece => piece !== null);

    return nearbyPieces.some((piece) => piece.player === move.player);
  }
}

export default ClassicBattleManager;
