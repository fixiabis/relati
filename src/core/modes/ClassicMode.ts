import { Board, Coordinate, Direction } from '../../primitives';
import InvalidMoveException from '../exceptions/InvalidMoveException';
import Game from '../Game';
import { GameMove, isPlacement, Placement } from '../moves';
import GameStatus from '../GameStatus';
import Piece from '../Piece';
import GameMode from './GameMode';

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

class ClassicMode extends GameMode {
  public readonly name: string;

  constructor() {
    super();
    this.name = 'classic';
    this.validMoveTypes.push('placement');
  }

  public createBoard(numberOfPlayers: number = 2): Board<Piece> {
    return new Board<Piece>({ width: numberOfPlayers * 2 + 1 });
  }

  public executeMove(game: Game, move: GameMove): void {
    this.ensureMoveValid(game, move);

    if (isPlacement(move)) {
      return this.executePlacement(game, move);
    }
  }

  public prepareForNextMove(game: Game): void {
    this.eliminatePlayersWhoCannotMove(game);
    this.endGameIfValid(game);

    if (!game.ended) {
      this.changeCurrentPlayerToNext(game);
    }
  }

  public checkPlacement(game: Game, move: Placement): boolean {
    const [x, y] = move.coordinate;
    const coordinateHasTaken = game.board.pieces[x]![y] !== null;

    if (coordinateHasTaken) {
      return false;
    }

    if (game.status === GameStatus.Opening) {
      return true;
    }

    const nearbyCoordinates = nearbyDirections
      .map(([dx, dy]) => [x + dx, y + dy] as Coordinate)
      .filter(game.board.hasCoordinate.bind(game.board));

    const nearbyPieces = nearbyCoordinates
      .map(([x, y]) => game.board.pieces[x]![y])
      .filter((piece): piece is Piece => piece !== null);

    return nearbyPieces.some((piece) => piece.player === move.player);
  }

  protected ensurePlacementValid(game: Game, move: Placement): void {
    if (!game.board.hasCoordinate(move.coordinate)) {
      throw new InvalidMoveException('動作座標不存在');
    }

    if (!this.checkPlacement(game, move)) {
      throw new InvalidMoveException('動作不符規則');
    }
  }

  protected executePlacement(game: Game, move: Placement): void {
    this.ensurePlacementValid(game, move);

    const piece = { player: move.player };

    game.board = game.board.putPiece(move.coordinate, piece);
    game.moveRecord = [...game.moveRecord, move];

    if (game.status === GameStatus.Opening) {
      const players = this.getPlayersOf(game);
      const survivingPlayers = players.filter((player) => !game.eliminatedPlayers.includes(player));
      const playerHasMoved = (player: number) => game.moveRecord.some((move) => move.player === player);

      if (survivingPlayers.every(playerHasMoved)) {
        game.status = GameStatus.Middle;
      }
    }
  }

  public checkPlayerCanMove(game: Game, player: number): boolean {
    return this.checkPlayerCanPlacement(game, player);
  }

  public checkPlayerCanPlacement(game: Game, player: number): boolean {
    if (game.status === GameStatus.Opening) {
      return true;
    }

    for (let x = 0; x < game.board.width; x++) {
      for (let y = 0; y < game.board.height; y++) {
        const coordinate = [x, y] as const;
        const move = { player, coordinate };
        const playerCanPlacement = this.checkPlacement(game, move);

        if (playerCanPlacement) {
          return true;
        }
      }
    }

    return false;
  }

  protected eliminatePlayersWhoCannotMove(game: Game) {
    const players = this.getPlayersOf(game);
    const isSurvivingPlayer = (player: number) => !game.eliminatedPlayers.includes(player);
    const survivingPlayers = players.filter(isSurvivingPlayer);
    const playerCannotMove = (player: number) => !this.checkPlayerCanMove(game, player);
    const eliminatedPlayers = survivingPlayers.filter(playerCannotMove);
    game.eliminatedPlayers = game.eliminatedPlayers.concat(eliminatedPlayers);
  }

  protected endGameIfValid(game: Game): void {
    const numberOfSurvivingPlayers = game.numberOfPlayers - game.eliminatedPlayers.length;

    if (numberOfSurvivingPlayers > 1) {
      return;
    }

    if (numberOfSurvivingPlayers === 0) {
      return this.endGame(game);
    }

    const players = this.getPlayersOf(game);
    const isSurvivingPlayer = (player: number) => !game.eliminatedPlayers.includes(player);
    const survivingPlayer = players.find(isSurvivingPlayer)!;

    if (survivingPlayer === game.currentPlayer) {
      this.endGame(game, survivingPlayer);
    }
  }

  protected changeCurrentPlayerToNext(game: Game): void {
    const players = this.getPlayersOf(game);
    const isSurvivingPlayer = (player: number) => !game.eliminatedPlayers.includes(player);

    const nextSurvivingPlayer = players
      .slice(game.currentPlayer + 1)
      .concat(players.slice(0, game.currentPlayer))
      .find(isSurvivingPlayer);

    game.currentPlayer = nextSurvivingPlayer!;
  }
}

export default ClassicMode;
