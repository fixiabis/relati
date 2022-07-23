import { Board, BoardSquare } from '../../board';
import { AbsoluteCoordinate } from '../../coordinates';
import { Piece } from '../../piece';
import { Player } from '../../players/proto-1/Player';

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

  constructor(players: Player<Game>[], board: Board, init: GameInit) {
    this.players = players;
    this.board = board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
  }

  public placePiece(player: Player<Game>, coordinate: AbsoluteCoordinate): void {
    this.onTurnStart(player);

    const square = this.board.squareAt(coordinate);
    const piece = player.createPiece(square, this);

    this.onPlacePiece(piece);
    square.placePiece(piece);
    this.onPlacedPiece(piece);

    this.onTurnEnd();
  }

  protected onTurnStart(player: Player<Game>) {
    this.validateIsActivePlayer(player);
  }

  private validateIsActivePlayer(player: Player<Game>): void {
    if (player !== this.activePlayer) {
      throw new Error('Invalid action, player not active');
    }
  }

  protected onPlacePiece(piece: Piece): void {
    this.validatePieceCanPlace(piece);
  }

  private validatePieceCanPlace(piece: Piece): void {
    if (!this.pieceCanPlace(piece)) {
      throw new Error(`Invalid action, can't place piece at: ${piece.square.coordinate}`);
    }
  }

  protected abstract pieceCanPlace(piece: Piece): boolean;

  protected onPlacedPiece(_piece: Piece): void {}

  protected onTurnEnd() {
    this.nextPlayerTurnOrEnd();
  }

  private nextPlayerTurnOrEnd(): void {
    const nextPlayer = this.playersAfterActivePlayer.find((who) => this.playerCanPlacePiece(who)) || null;

    if (nextPlayer) {
      this.activePlayer = nextPlayer;
      return;
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
    const squareCanPlacePiece = (square: BoardSquare) =>
      !square.piece && this.pieceCanPlace(player.createPiece(square, this));

    return this.board.squareList.some(squareCanPlacePiece);
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
}
