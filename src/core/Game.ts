import { Board } from './board/Board';
import { Coordinate } from './coordinates/Coordinate';
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

  public abstract placePiece(player: Player, coordinate: Coordinate): void;
}
