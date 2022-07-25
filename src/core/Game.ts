import { Board } from './board/Board';
import { BoardSquare } from './board/BoardSquare';
import { Position, PositionCoordinate } from './coordinates/PositionCoordinate';
import { Piece } from './Piece';
import { Player } from './Player';

export interface GameInit {
  board: Board<Piece>;
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player;
  allPlayersHavePlaced?: boolean;
}

export abstract class Game {
  public readonly players: readonly Player[];
  public readonly board: Board<Piece>;
  public ended: boolean;
  public winner: Player | null;
  public activePlayer: Player;
  public allPlayersHavePlaced: boolean;

  constructor(players: Player[], init: GameInit) {
    this.players = players;
    this.board = init.board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this.allPlayersHavePlaced = init.allPlayersHavePlaced || false;
  }

  public placePiece(player: Player, position: Position): void {
    this.beforePlacePiece(player, position);

    const positionCoordinate = PositionCoordinate.parse(position);
    const square = this.board.squareAt(positionCoordinate);
    this.placePieceOnSquare(player, square);

    this.afterPlacePiece(square.piece!);
  }

  protected beforePlacePiece(player: Player, _position: Position): void {
    if (player !== this.activePlayer) {
      throw new Error('Player not active');
    }
  }

  protected abstract placePieceOnSquare(player: Player, square: BoardSquare<Piece>): void;

  protected afterPlacePiece(_piece: Piece): void {
    this.changeNextPlayerOrEnd();
  }

  protected abstract changeNextPlayerOrEnd(): void;
}
