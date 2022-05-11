import type Board from './Board';
import type Move from './moves/Move';
import Placement, { isPlacement } from './moves/Placement';

export interface GameProps {
  readonly numberOfPlayers: number;
  board: Board;
  currentPlayer?: number;
  eliminatedPlayers?: readonly number[];
  winner?: number;
  ended?: boolean;
  moves?: readonly Move[];
}

class Game {
  public static readonly NO_WINNER = -1;

  public readonly numberOfPlayers: number;
  public board: Board;
  public currentPlayer: number;
  public eliminatedPlayers: readonly number[];
  public winner: number;
  public ended: boolean;
  public moves: readonly Move[];

  constructor(props: GameProps) {
    this.numberOfPlayers = props.numberOfPlayers;
    this.board = props.board;
    this.currentPlayer = props.currentPlayer || 0;
    this.eliminatedPlayers = props.eliminatedPlayers || [];
    this.winner = props.winner ?? Game.NO_WINNER;
    this.ended = props.ended || false;
    this.moves = props.moves || [];
  }

  public addMove(move: Move): void {
    if (isPlacement(move)) {
      return this.addPlacement(move);
    }
  }

  public addPlacement(move: Placement): void {
    this.board = this.board.placePiece(move.coordinate, move.piece);
    this.moves = [...this.moves, move];
  }

  public eliminatePlayer(player: number): void {
    this.eliminatedPlayers = [...this.eliminatedPlayers, player];
  }

  public changeCurrentPlayer(player: number): void {
    this.currentPlayer = player;
  }

  public endByWinner(player: number = Game.NO_WINNER): void {
    this.winner = player;
    this.ended = true;
  }

  public updateBoard(board: Board): void {
    this.board = board;
  }

  public nextPlayer(player: number = this.currentPlayer): number {
    return (player + 1) % this.numberOfPlayers;
  }

  public nextPlayers(player: number = this.currentPlayer): number[] {
    const players = Array.from({ length: this.numberOfPlayers }).map((_, player) => player);
    return players.slice(player + 1).concat(players.slice(0, player));
  }
}

export default Game;
