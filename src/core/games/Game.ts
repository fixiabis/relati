import { Board } from '../board';
import { AbsoluteCoordinate } from '../coordinates';
import { Piece } from '../piece';
import { Player } from '../players/Player';

export interface GameInit {
  ended?: boolean;
  winner?: Player<Game> | null;
  activePlayer?: Player<Game> | null;
  rootPlacing?: boolean;
}

export abstract class Game {
  public readonly players: readonly Player<Game>[];
  public readonly board: Board;

  private _ended!: boolean;
  private _winner!: Player<Game> | null;
  private _activePlayer!: Player<Game>;
  private _rootPlacing!: boolean;

  constructor(players: Player<Game>[], board: Board, init: GameInit) {
    this.players = players;
    this.board = board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this.rootPlacing = init.rootPlacing ?? true;
    this.activePlayer.onTurned(this);
  }

  public placePiece(player: Player<Game>, coordinate: AbsoluteCoordinate): void {
    const square = this.board.squareAt(coordinate);
    const piece = player.createPiece(square, this);

    if (!this.pieceCanPlace(piece)) {
      throw new Error(`Invalid action, can't place piece at: ${piece.square.coordinate}`);
    }

    square.placePiece(piece);
    this.onPlacedPiece();
  }

  protected abstract pieceCanPlace(piece: Piece): boolean;

  protected onPlacedPiece(): void {
    this.nextPlayerTurnOrEnd();
  }

  private nextPlayerTurnOrEnd() {
    const playerWhoCanPlacePiece = this.playersAfterActivePlayer.find((who) => this.playerCanPlacePiece(who)) || null;

    if (playerWhoCanPlacePiece) {
      this.activePlayer = playerWhoCanPlacePiece;
      return this.activePlayer.onTurned(this);
    }

    if (this.playerCanPlacePiece(this.activePlayer)) {
      this.winner = this.activePlayer;
    }

    this.ended = true;
  }

  private get playersAfterActivePlayer(): Player<Game>[] {
    const activePlayerIndex = this.players.indexOf(this._activePlayer);
    return this.players.slice(activePlayerIndex + 1).concat(this.players.slice(0, activePlayerIndex));
  }

  private playerCanPlacePiece(player: Player<Game>): boolean {
    return this.board.squareList.some(
      (square) => !square.piece && this.pieceCanPlace(player.createPiece(square, this))
    );
  }

  public get ended(): boolean {
    return this._ended;
  }

  private set ended(value: boolean) {
    this._ended = value;
  }

  public get winner(): Player<Game> | null {
    return this._winner;
  }

  private set winner(value: Player<Game> | null) {
    this._winner = value;
  }

  public get activePlayer(): Player<Game> {
    return this._activePlayer;
  }

  private set activePlayer(value: Player<Game>) {
    this._activePlayer = value;
  }

  public get rootPlacing(): boolean {
    return this._rootPlacing;
  }

  public set rootPlacing(value: boolean) {
    this._rootPlacing = value;
  }
}
