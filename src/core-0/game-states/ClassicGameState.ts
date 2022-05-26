import Board from '../Board';
import GameMove from '../GameMove';
import GameState from './GameState';

class ClassicGameState implements GameState {
  public numberOfPlayers: number;
  public allPlayersHaveMoved: boolean;
  public board: Board;
  public currentPlayer: number;
  public eliminatedPlayers: readonly number[];
  public winner: number;
  public ended: boolean;
  public moves: readonly GameMove[];

  constructor(state: Partial<ClassicGameState>) {
    this.numberOfPlayers = state.numberOfPlayers || 2;
    this.allPlayersHaveMoved = state.allPlayersHaveMoved || false;
    this.board = state.board || new Board({ width: this.numberOfPlayers * 2 + 1 });
    this.currentPlayer = state.currentPlayer || 0;
    this.eliminatedPlayers = state.eliminatedPlayers || [];
    this.winner = state.winner || -1;
    this.ended = state.ended || false;
    this.moves = state.moves || [];
  }
}

export default ClassicGameState;
