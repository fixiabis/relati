import Game from '../Game';
import Move from '../moves/Move';

interface GameManager {
  createGame(numberOfPlayers: number): Game;
  addMoveInGame(game: Readonly<Game>, move: Move): void;
}

export default GameManager;
