import Board from '../Board';
import Direction from '../Direction';
import Battle from '../Battle';
import Placement, { isPlacement } from '../moves/Placement';
import Piece from '../Piece';
import { Coordinate } from '../types';
import BaseBattleManager from './BaseBattleManager';

type CoordinatePath = [Coordinate, ...Coordinate[]];

const nearbyDirectionPaths: CoordinatePath[] = [
  [Direction.F],
  [Direction.B],
  [Direction.L],
  [Direction.R],

  [Direction.FL],
  [Direction.FR],
  [Direction.BL],
  [Direction.BR],

  [Direction.FF, Direction.F],
  [Direction.BB, Direction.B],
  [Direction.LL, Direction.L],
  [Direction.RR, Direction.R],

  [Direction.FFLL, Direction.FL],
  [Direction.FFRR, Direction.FR],
  [Direction.BBLL, Direction.BL],
  [Direction.BBRR, Direction.BR],

  [Direction.FFL, Direction.FF, Direction.F],
  [Direction.FFR, Direction.FF, Direction.F],
  [Direction.BBL, Direction.BB, Direction.B],
  [Direction.BBR, Direction.BB, Direction.B],

  [Direction.FLL, Direction.LL, Direction.L],
  [Direction.FRR, Direction.RR, Direction.R],
  [Direction.BLL, Direction.LL, Direction.L],
  [Direction.BRR, Direction.RR, Direction.R],

  [Direction.FFL, Direction.FL, Direction.F],
  [Direction.FFR, Direction.FR, Direction.F],
  [Direction.BBL, Direction.BL, Direction.B],
  [Direction.BBR, Direction.BR, Direction.B],

  [Direction.FLL, Direction.FL, Direction.L],
  [Direction.FRR, Direction.FR, Direction.R],
  [Direction.BLL, Direction.BL, Direction.L],
  [Direction.BRR, Direction.BR, Direction.R],

  [Direction.FLL, Direction.FL, Direction.F],
  [Direction.FRR, Direction.FR, Direction.F],
  [Direction.BLL, Direction.BL, Direction.B],
  [Direction.BRR, Direction.BR, Direction.B],

  [Direction.FFL, Direction.FL, Direction.L],
  [Direction.FFR, Direction.FR, Direction.R],
  [Direction.BBL, Direction.BL, Direction.L],
  [Direction.BBR, Direction.BR, Direction.R],
];

class ModernBattleManager extends BaseBattleManager {
  public createBattle(numberOfPlayers: number): Readonly<Battle> {
    return new Battle({
      numberOfPlayers,
      board: new Board({ width: numberOfPlayers * 4 + 1 }),
    });
  }

  protected override judgePlacementValid(battle: Readonly<Battle>, move: Placement) {
    const allPlayersHasFirstMove = battle.moves.length >= battle.numberOfPlayers;

    if (!allPlayersHasFirstMove && move.piece.type !== 'root') {
      throw new Error('放置不符規則，棋子類型應為根源');
    }

    if (allPlayersHasFirstMove && move.piece.type === 'root') {
      throw new Error('放置不符規則，棋子類型不應為根源');
    }

    super.judgePlacementValid(battle, move);
  }

  protected checkPlacementValidAfterFirstMove(battle: Readonly<Battle>, move: Placement): boolean {
    const [x, y] = move.coordinate;

    const nearbyCoordinatePaths = nearbyDirectionPaths
      .map((path) => path.map<Coordinate>(([dx, dy]) => [x + dx, y + dy]) as CoordinatePath)
      .filter((path) => path.every(battle.board.hasCoordinate.bind(battle.board)));

    const enabledNearbyPieces = nearbyCoordinatePaths
      .map((path) => path.map(([x, y]) => battle.board.pieces[x]![y]))
      .filter((pieces): pieces is [Piece] => pieces[0] !== null && !pieces[0]?.disabled)
      .filter((pieces) => pieces.slice(1).every((piece) => piece === null));

    return enabledNearbyPieces.some(([piece]) => piece.player === move.player);
  }

  protected override prepareNextTurn(battle: Readonly<Battle>): void {
    this.updatePieceStatus(battle);
    super.prepareNextTurn(battle);
  }

  protected updatePieceStatus(battle: Readonly<Battle>): void {
    this.disablePieces(battle);
    this.enablePiecesByRoot(battle);
  }

  protected disablePieces(battle: Readonly<Battle>): void {
    const pieces = battle.board.pieces.map((pieces) => pieces.map((piece) => piece && { ...piece }));

    for (const piecesOfLine of pieces) {
      for (const piece of piecesOfLine) {
        if (piece) {
          piece.disabled = true;
        }
      }
    }

    battle.updateBoard(battle.board.updatePieces(pieces));
  }

  protected enablePiecesByRoot(battle: Readonly<Battle>): void {
    const pieces = battle.board.pieces.map((pieces) => pieces.map((piece) => piece && { ...piece }));

    const enabledCoordinates = battle.moves
      .filter(isPlacement)
      .filter((move) => move.piece.type === 'root')
      .map((move) => move.coordinate);

    for (const coordinate of enabledCoordinates) {
      const [x, y] = coordinate;
      const sourcePiece = pieces[x]![y]!;

      const isPathOfPieceCanEnable = (path: CoordinatePath) => {
        const [piece, ...otherPieces] = path.map(([x, y]) => battle.board.pieces[x]![y]);
        return piece?.player === sourcePiece.player && piece.disabled && otherPieces.every((piece) => piece === null);
      };

      const enableNeededCoordinates = nearbyDirectionPaths
        .map((path) => path.map<Coordinate>(([dx, dy]) => [x + dx, y + dy]) as CoordinatePath)
        .filter((path) => path.every(battle.board.hasCoordinate.bind(battle.board)))
        .filter(isPathOfPieceCanEnable)
        .filter(([[x, y]], index, paths) => index === paths.findIndex(([[xOfP, yOfP]]) => xOfP === x && yOfP === y))
        .map(([coordinate]) => coordinate);

      enabledCoordinates.push(...enableNeededCoordinates);
      delete sourcePiece.disabled;
    }
  }
}

export default ModernBattleManager;
