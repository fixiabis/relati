import TBS from '../lib/TurnBasedStrategy';
import Direction from '../Direction';
import ClassicGameState from '../game-states/ClassicGameState';
import GameMove from '../GameMove';
import Piece from '../Piece';
import { Coordinate } from '../types';

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

class ClassicGameMode extends TBS.FlowStep<ClassicGameState, GameMove> {
  public readonly name: string = 'relati-classic';

  public override prepare(state: ClassicGameState): Promise<void> {
    this.eliminatePlayersWhoCannotMove(state);
    this.endGameIfValid(state);

    const currentPlayerHasEliminated = state.eliminatedPlayers.includes(state.currentPlayer);

    if (currentPlayerHasEliminated) {
      this.changeCurrentPlayerToNext(state);
    }

    return Promise.resolve();
  }

  public checkMove(move: GameMove, state: Readonly<ClassicGameState>): boolean {
    const [x, y] = move.coordinate;
    const squareOfCoordinateHasTaken = state.board.pieces[x]![y] !== null;

    if (squareOfCoordinateHasTaken) {
      return false;
    }

    if (!state.allPlayersHaveMoved) {
      return true;
    }

    const nearbyCoordinates = nearbyDirections
      .map(([dx, dy]) => [x + dx, y + dy] as Coordinate)
      .filter(state.board.hasCoordinate.bind(state.board));

    const nearbyPieces = nearbyCoordinates
      .map(([x, y]) => state.board.pieces[x]![y])
      .filter((piece): piece is Readonly<Piece> => piece !== null);

    return nearbyPieces.some((piece) => piece.player === move.player);
  }

  protected judgeMove(move: GameMove, state: Readonly<ClassicGameState>): void {
    if (state.ended) {
      throw new Error('invalid move: game is ended');
    }

    if (move.player !== state.currentPlayer) {
      throw new Error('invalid move: not current player');
    }

    if (!state.board.hasCoordinate(move.coordinate)) {
      throw new Error('invalid move: invalid coordinate');
    }

    if (!this.checkMove(move, state)) {
      throw new Error('invalid move: unable to place');
    }
  }

  protected executeMove(move: GameMove, state: ClassicGameState): void {
    const piece = { player: move.player };

    state.board = state.board.placePiece(move.coordinate, piece);
    state.moves = [...state.moves, move];

    if (!state.allPlayersHaveMoved) {
      const players = Array.from({ length: state.numberOfPlayers }).map((_, player) => player);
      const survivingPlayers = players.filter((player) => !state.eliminatedPlayers.includes(player));
      const playerHasMoved = (player: number) => state.moves.some((move) => move.player === player);
      state.allPlayersHaveMoved = survivingPlayers.every(playerHasMoved);
    }
  }

  public checkPlayerCanMove(player: number, state: ClassicGameState): boolean {
    if (!state.allPlayersHaveMoved) {
      return true;
    }

    for (let x = 0; x < state.board.width; x++) {
      for (let y = 0; y < state.board.height; y++) {
        const coordinate = [x, y] as const;
        const move = { player, coordinate };
        const playerCanMove = this.checkMove(move, state);

        if (playerCanMove) {
          return true;
        }
      }
    }

    return false;
  }

  protected eliminatePlayersWhoCannotMove(state: ClassicGameState) {
    const players = Array.from({ length: state.numberOfPlayers }).map((_, player) => player);
    const isSurvivingPlayer = (player: number) => !state.eliminatedPlayers.includes(player);
    const survivingPlayers = players.filter(isSurvivingPlayer);
    const playerCannotMove = (player: number) => !this.checkPlayerCanMove(player, state);
    const eliminatedPlayers = survivingPlayers.filter(playerCannotMove);
    state.eliminatedPlayers = state.eliminatedPlayers.concat(eliminatedPlayers);
  }

  protected endGameIfValid(state: ClassicGameState): void {
    const numberOfSurvivingPlayers = state.numberOfPlayers - state.eliminatedPlayers.length;

    if (numberOfSurvivingPlayers > 1) {
      return;
    }

    if (numberOfSurvivingPlayers === 0) {
      state.winner = -1;
      state.ended = true;
      return;
    }

    const players = Array.from({ length: state.numberOfPlayers }).map((_, player) => player);
    const isSurvivingPlayer = (player: number) => !state.eliminatedPlayers.includes(player);
    const survivingPlayer = players.find(isSurvivingPlayer)!;

    if (survivingPlayer === state.currentPlayer) {
      state.winner = survivingPlayer;
      state.ended = true;
    }
  }

  protected changeCurrentPlayerToNext(state: ClassicGameState): void {
    const players = Array.from({ length: state.numberOfPlayers }).map((_, player) => player);
    const isSurvivingPlayer = (player: number) => !state.eliminatedPlayers.includes(player);

    const nextSurvivingPlayer = players
      .slice(state.currentPlayer + 1)
      .concat(players.slice(0, state.currentPlayer))
      .find(isSurvivingPlayer);

    state.currentPlayer = nextSurvivingPlayer!;
  }

  protected prepareForNext(state: ClassicGameState): void {
    this.eliminatePlayersWhoCannotMove(state);
    this.endGameIfValid(state);

    if (!state.ended) {
      this.changeCurrentPlayerToNext(state);
    }
  }
}

export default ClassicGameMode;
