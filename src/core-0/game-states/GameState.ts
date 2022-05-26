import Board from '../Board';
import GameMove from '../GameMove';

interface GameState {
  numberOfPlayers: number;
  allPlayersHaveMoved: boolean;
  board: Board;
  currentPlayer: number;
  eliminatedPlayers: readonly number[];
  winner: number;
  ended: boolean;
  moves: readonly GameMove[];
}

export default GameState;
