import Direction from '../Direction';
import GameMove from '../GameMove';
import GameState from '../game-states/ModernGameState';
import Piece from '../Piece';
import { Coordinate } from '../types';
import ClassicGameMode from './ClassicGameMode';
import * as utils from '../utils';
import TBS from '../lib/TurnBasedStrategy';

type Path<T> = [T, ...T[]];

type CoordinatePath = Path<Coordinate>;

type ReadonlyPiecePath = Path<Readonly<Piece> | null>;

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

class ModernGameMode extends ClassicGameMode implements TBS.FlowStep<GameState, GameMove> {
  public override readonly name: string = 'relati';

  protected override checkMove(move: GameMove, state: Readonly<GameState>): boolean {
    const [x, y] = move.coordinate;
    const squareOfCoordinateHasTaken = state.board.pieces[x]![y] !== null;

    if (squareOfCoordinateHasTaken) {
      return false;
    }

    if (!state.allPlayersHaveMoved) {
      return true;
    }

    const isValidPiecePath = (
      pieces: [Readonly<Piece> | null, ...(Readonly<Piece> | null)[]]
    ): pieces is [Readonly<Piece>, ...null[]] => {
      const [targetPiece, ...otherPieces] = pieces;
      return targetPiece !== null && otherPieces.every((piece) => piece === null);
    };

    const nearbyCoordinatePaths = nearbyDirectionPaths
      .map((path) => path.map<Coordinate>(([dx, dy]) => [x + dx, y + dy]) as CoordinatePath)
      .filter((path) => path.every(state.board.hasCoordinate.bind(state.board)));

    const nearbyPiecePaths = nearbyCoordinatePaths
      .map((path) => path.map(([x, y]) => state.board.pieces[x]![y]) as ReadonlyPiecePath)
      .filter(isValidPiecePath);

    const nearbyPiecesOfPath = nearbyPiecePaths.map(([piece]) => piece);

    return nearbyPiecesOfPath.some((piece) => !piece.disabled && piece.player === move.player);
  }

  protected override executeMove(move: GameMove, state: GameState): void {
    const allPlayersHaveMoved = state.allPlayersHaveMoved;

    super.executeMove(move, state);

    if (!allPlayersHaveMoved) {
      state.rootCoordinates = [...state.rootCoordinates, move.coordinate];
    }
  }

  protected updatePieceStatus(state: GameState): void {
    const pieces = state.board.pieces.map((pieces) => pieces.map((piece) => piece && { ...piece, disabled: true }));
    const sourceIndexes = [...state.rootCoordinates].map(utils.convertCoordinateToIndex);

    const coordinatePathOfPieceCanEnable = (player: number) => (path: CoordinatePath) => {
      const [piece, ...otherPieces] = path.map(([x, y]) => state.board.pieces[x]![y]) as ReadonlyPiecePath;
      return piece?.player === player && piece.disabled && otherPieces.every((piece) => piece === null);
    };

    for (const sourceIndex of sourceIndexes) {
      const [x, y] = utils.convertIndexToCoordinate(sourceIndex);
      const sourcePiece = pieces[x]![y] as Piece;

      const nearbyCoordinatePaths = nearbyDirectionPaths
        .map((path) => path.map<Coordinate>(([dx, dy]) => [x + dx, y + dy]) as CoordinatePath)
        .filter((path) => path.every(state.board.hasCoordinate.bind(state.board)));

      const nextSourceIndexes = nearbyCoordinatePaths
        .filter(coordinatePathOfPieceCanEnable(sourcePiece.player))
        .map(([coordinate]) => utils.convertCoordinateToIndex(coordinate))
        .filter((number) => !sourceIndexes.includes(number));

      sourceIndexes.push(...nextSourceIndexes);
      delete sourcePiece.disabled;
    }

    state.board = state.board.updatePieces(pieces);
  }

  protected override prepareForNext(state: GameState) {
    this.updatePieceStatus(state);
    return super.prepareForNext(state);
  }
}

export default ModernGameMode;
