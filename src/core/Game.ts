import { Board, Coordinate } from '../primitives';
import { GameMove } from './moves';
import GameStatus from './GameStatus';
import GameMode from './modes/GameMode';
import Piece from './Piece';

export interface GameProps {
  mode: GameMode;
  numberOfPlayers?: number;
  status?: GameStatus;
  ended?: boolean;
  board?: Board<Piece>;
  winner?: number;
  currentPlayer?: number;
  eliminatedPlayers?: number[];
  moveRecord?: GameMove[];
  coordinatesOfPieceType?: Readonly<Record<string, readonly Coordinate[]>>;
}

class Game {
  public readonly mode: GameMode;
  public readonly numberOfPlayers: number;
  public status: GameStatus;
  public ended: boolean;
  public board: Board<Piece>;
  public winner: number;
  public currentPlayer: number;
  public eliminatedPlayers: readonly number[];
  public moveRecord: readonly GameMove[];
  public coordinatesOfPieceType: Readonly<Record<string, readonly Coordinate[]>>;

  constructor(props: GameProps) {
    this.mode = props.mode;
    this.numberOfPlayers = props.numberOfPlayers || 2;
    this.status = props.status || GameStatus.Initial;
    this.ended = props.ended || false;
    this.board = props.board || this.mode.createBoard(this.numberOfPlayers);
    this.winner = props.winner || -1;
    this.currentPlayer = props.currentPlayer || 0;
    this.eliminatedPlayers = props.eliminatedPlayers || [];
    this.moveRecord = props.moveRecord || [];
    this.coordinatesOfPieceType = props.coordinatesOfPieceType || {};
    this.mode.prepare(this);
  }

  public makeMove(move: GameMove): void {
    this.mode.handleMove(this, move);
    this.mode.prepareForNextMove(this);
  }
}

export default Game;
