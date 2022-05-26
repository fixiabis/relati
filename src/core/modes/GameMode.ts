import { Board } from '../../primitives';
import InvalidMoveException from '../exceptions/InvalidMoveException';
import Game from '../Game';
import { GameMove } from '../moves';
import GameStatus from '../GameStatus';
import Piece from '../Piece';

export interface GameModeProps {
  validMoveTypes?: string[];
}

abstract class GameMode {
  public abstract readonly name: string;
  protected readonly validMoveTypes: string[] = [];
  private readonly players: Record<number, readonly number[]> = {};

  public abstract createBoard(numberOfPlayers?: number): Board<Piece>;

  public prepare(game: Game): void {}

  public abstract executeMove(game: Game, move: GameMove): void;

  public abstract prepareForNextMove(game: Game): void;

  protected ensureMoveValid(game: Game, move: GameMove): void {
    if (game.ended) {
      throw new InvalidMoveException('遊戲已經結束');
    }

    if (move.player !== game.currentPlayer) {
      throw new InvalidMoveException('玩家不可動作');
    }

    if (move.type && !this.validMoveTypes.includes(move.type)) {
      throw new InvalidMoveException('動作類型不明');
    }
  }

  protected getPlayersOf(game: Game): readonly number[] {
    const { numberOfPlayers } = game;

    if (!this.players[numberOfPlayers]) {
      this.players[numberOfPlayers] = Array.from({ length: numberOfPlayers }, (_, player) => player);
    }

    return this.players[numberOfPlayers]!;
  }

  protected endGame(game: Game, winner: number = -1, status: GameStatus = GameStatus.Ended): void {
    game.winner = winner;
    game.status = status;
    game.ended = true;
  }
}

export default GameMode;
