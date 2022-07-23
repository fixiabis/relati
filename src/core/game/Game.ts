import { Board } from '../board/Board';
import { Player } from '../player/Player';
import { RelationMode } from '../relation/RelationMode';

export interface GameInit {
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player;
  relationMode?: RelationMode;
  allRootPlaced?: boolean;
}

export class Game {
  public readonly players: readonly Player[];
  public readonly board: Board;
  public readonly relationMode: RelationMode;
  public ended: boolean;
  public winner: Player | null;
  public activePlayer: Player;
  public allRootPlaced: boolean;

  constructor(players: Player[], board: Board, init: GameInit) {
    this.players = players;
    this.board = board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this.relationMode = init.relationMode || RelationMode.Modern;
    this.allRootPlaced = init.allRootPlaced || false;
  }
}
