import { Board, BoardSquare } from '../../board';
import { AbsoluteCoordinate } from '../../coordinates';
import { Piece } from '../../piece';
import { Player } from '../../players/proto-0';

export interface GameInit {
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player | null;
}

export abstract class Game {
  public readonly players: readonly Player[];
  public readonly board: Board;

  private _ended!: boolean;

  public get ended(): boolean {
    return this._ended;
  }

  private set ended(value: boolean) {
    this._ended = value;
  }

  private _winner!: Player | null;

  public get winner(): Player | null {
    return this._winner;
  }

  private set winner(value: Player | null) {
    this._winner = value;
  }

  private _activePlayer!: Player;

  public get activePlayer(): Player {
    return this._activePlayer;
  }

  private set activePlayer(value: Player) {
    this._activePlayer = value;
  }

  private get playersAfterActivePlayer(): Player[] {
    const activePlayerIndex = this.players.indexOf(this._activePlayer);
    return this.players.slice(activePlayerIndex + 1).concat(this.players.slice(0, activePlayerIndex));
  }

  protected get allPieces(): Piece[] {
    return this.board.squareList.map((square) => square.piece!).filter(Boolean);
  }

  constructor(players: Player[], board: Board, init: GameInit) {
    this.players = players;
    this.board = board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this.activePlayer.takeTurn(this);
  }

  protected abstract canPlacePiece(player: Player, square: BoardSquare): boolean;

  private playerCanPlacePiece(player: Player): boolean {
    return this.board.squareList.some((square) => this.canPlacePiece(player, square));
  }

  protected createPiece(player: Player, square: BoardSquare): Piece {
    return new Piece(player.pieceSymbol, square);
  }

  public placePiece(player: Player, coordinate: AbsoluteCoordinate): void {
    this.onTurnStart(player);
    const square = this.board.squareAt(coordinate);

    if (!this.canPlacePiece(player, square)) {
      throw new Error('棋子無法放置');
    }

    const piece = this.createPiece(player, square);

    square.placePiece(piece);
    this.onPiecePlaced(piece);
    this.onTurnEnd(player);
  }

  protected onPiecePlaced(_piece: Piece): void {}

  protected onTurnStart(player: Player): void {
    if (player !== this.activePlayer) {
      throw new Error('玩家目前無法動作');
    }
  }

  protected onTurnEnd(_player: Player): void {
    this.changeNextPlayerOrEnd();
  }

  private changeNextPlayerOrEnd() {
    const playersWhoCanPlace = this.playersAfterActivePlayer.filter(this.playerCanPlacePiece.bind(this));

    if (playersWhoCanPlace.length > 0) {
      this.activePlayer = playersWhoCanPlace[0]!;
      return this.activePlayer.takeTurn(this);
    }

    if (this.playerCanPlacePiece(this.activePlayer)) {
      this.winner = this.activePlayer;
    }

    this.ended = true;
  }
}
