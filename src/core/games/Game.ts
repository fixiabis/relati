import { Board } from '../board';
import { AbsoluteCoordinate } from '../coordinates';
import { Player } from '../players/Player';

export interface GameInit {
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player | null;
}

export abstract class Game {
  public readonly players: readonly Player[];
  public readonly board: Board;

  private _ended!: boolean;
  private _winner!: Player | null;
  private _activePlayer!: Player;

  constructor(players: Player[], board: Board, init: GameInit) {
    this.players = players;
    this.board = board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
  }

  public abstract placePiece(player: Player, coordinate: AbsoluteCoordinate): void;

  public get ended(): boolean {
    return this._ended;
  }

  private set ended(value: boolean) {
    this._ended = value;
  }

  public get winner(): Player | null {
    return this._winner;
  }

  private set winner(value: Player | null) {
    this._winner = value;
  }

  public get activePlayer(): Player {
    return this._activePlayer;
  }

  private set activePlayer(value: Player) {
    this._activePlayer = value;
  }
}
