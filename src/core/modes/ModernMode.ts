import { Board, Coordinate, Direction } from '../../primitives';
import Game from '../Game';
import { Placement } from '../moves';
import GameStatus from '../GameStatus';
import Piece from '../Piece';
import { convertCoordinateToNumber, convertNumberToCoordinate } from '../utils';
import ClassicMode from './ClassicMode';

type Path<T> = [T, ...T[]];

type CoordinatePath = Path<Coordinate>;

type ReadonlyPiecePath = Path<Piece | null>;

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

class ModernMode extends ClassicMode {
  public override readonly name: string;

  constructor() {
    super();
    this.name = 'modern';
  }

  public override createBoard(numberOfPlayers: number = 2): Board<Piece> {
    return new Board<Piece>({ width: numberOfPlayers * 4 + 1 });
  }

  public override prepare(game: Game): void {
    super.prepare(game);

    if (!game.coordinatesOfPieceType['root']) {
      game.coordinatesOfPieceType = { ...game.coordinatesOfPieceType, root: [] };
    }
  }

  public override checkPlacement(game: Game, move: Placement): boolean {
    const [x, y] = move.coordinate;
    const coordinateHasTaken = game.board.pieces[x]![y] !== null;

    if (coordinateHasTaken) {
      return false;
    }

    if (game.status === GameStatus.Opening) {
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
      .filter((path) => path.every(game.board.hasCoordinate.bind(game.board)));

    const nearbyPiecePaths = nearbyCoordinatePaths
      .map((path) => path.map(([x, y]) => game.board.pieces[x]![y]) as ReadonlyPiecePath)
      .filter(isValidPiecePath);

    const nearbyPiecesOfPath = nearbyPiecePaths.map(([piece]) => piece);

    return nearbyPiecesOfPath.some((piece) => !piece.disabled && piece.player === move.player);
  }

  protected override handlePlacement(game: Game, move: Placement): void {
    const piece: Piece = { player: move.player };

    if (game.status === GameStatus.Opening) {
      piece.type = 'root';
    }

    game.board = game.board.putPiece(move.coordinate, piece);
    game.moveRecord = [...game.moveRecord, move];

    if (game.status === GameStatus.Opening) {
      const players = this.getPlayersOf(game);
      const survivingPlayers = players.filter((player) => !game.eliminatedPlayers.includes(player));
      const playerHasMoved = (player: number) => game.moveRecord.some((move) => move.player === player);

      const coordinatesOfType = { ...game.coordinatesOfPieceType };
      coordinatesOfType['root'] = [...coordinatesOfType['root']!, move.coordinate];
      game.coordinatesOfPieceType = coordinatesOfType;

      if (survivingPlayers.every(playerHasMoved)) {
        game.status = GameStatus.Middle;
      }
    }
  }

  // TODO: 改採用 communicationPaths 計算，並應整合至 handlePlacement 中。
  protected updatePieces(game: Game): void {
    const pieces = game.board.pieces.map((pieces) => pieces.map((piece) => piece && { ...piece, disabled: true }));
    const sourceIndexes = [...(game.coordinatesOfPieceType['root'] || [])].map(convertCoordinateToNumber);

    const coordinatePathOfPieceCanEnable = (player: number) => (path: CoordinatePath) => {
      const [piece, ...otherPieces] = path.map(([x, y]) => pieces[x]![y]) as ReadonlyPiecePath;
      return piece?.player === player && piece.disabled && otherPieces.every((piece) => piece === null);
    };

    for (const sourceIndex of sourceIndexes) {
      const [x, y] = convertNumberToCoordinate(sourceIndex);
      const sourcePiece: Piece = pieces[x]![y]!;

      const nearbyCoordinatePaths = nearbyDirectionPaths
        .map((path) => path.map<Coordinate>(([dx, dy]) => [x + dx, y + dy]) as CoordinatePath)
        .filter((path) => path.every(game.board.hasCoordinate.bind(game.board)));

      const nextSourceIndexes = nearbyCoordinatePaths
        .filter(coordinatePathOfPieceCanEnable(sourcePiece.player))
        .map(([coordinate]) => convertCoordinateToNumber(coordinate))
        .filter((index) => !sourceIndexes.includes(index));

      sourceIndexes.push(...nextSourceIndexes);
      delete sourcePiece.disabled;
    }

    game.board = game.board.putAllPieces(pieces);
  }

  public override prepareForNextMove(state: Game) {
    this.updatePieces(state);
    return super.prepareForNextMove(state);
  }
}

export default ModernMode;
