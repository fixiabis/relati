import { Board } from "./Board";
import { BoardSquare } from "./BoardSquare";
import { Piece, PieceSymbol } from "./Piece";
import { Player } from "./Player";
import { Position, PositionCode } from "./Position";

export interface GameInit<TPiece extends Piece, TPlayer extends Player> {
  board?: Board<TPiece>;
  activePlayer?: TPlayer;
  winner?: TPlayer | null;
  ended?: boolean;
}

export class Game<TPiece extends Piece, TPlayer extends Player> {
  public readonly players: readonly TPlayer[];
  public readonly board: Board<TPiece>;
  public activePlayer: TPlayer;
  public winner: TPlayer | null;
  public ended: boolean;
  private _allPlayersHavePiece?: boolean;

  constructor(players: TPlayer[], init: GameInit<TPiece, TPlayer> = {}) {
    this.players = players;
    this.board = init.board || this.createBoard(players);
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
  }

  protected createBoard(players: TPlayer[]): Board<TPiece> {
    return new Board<TPiece>(players.length * 2 + 1);
  }

  public placePiece(pieceSymbol: PieceSymbol, positionCode: PositionCode): void {
    this.validateCanPlacePiece(pieceSymbol);
    const position = this.parsePosition(positionCode);
    const square = this.boardSquareAt(position);

    this.validateCanPlacePieceOnSquare(square);
    this.placePieceOnSquare(square, pieceSymbol);
  }

  private validateCanPlacePiece(pieceSymbol: PieceSymbol): void {
    if (pieceSymbol !== this.activePlayer.pieceSymbol) {
      throw new Error("非玩家回合的符號");
    }
  }

  private parsePosition(positionCode: PositionCode): Position {
    if (!Position.isParsableCode(positionCode)) {
      throw new Error("無法解析的位置");
    }

    return Position.parse(positionCode);
  }

  private boardSquareAt(position: Position): BoardSquare<TPiece> {
    if (!this.board.squareDefinedAt(position)) {
      throw new Error("不存在的格子");
    }

    return this.board.squareAt(position);
  }

  protected validateCanPlacePieceOnSquare(square: BoardSquare<TPiece>): void {
    if (square.piece) {
      throw new Error(`格子${square.position}已有棋子`);
    }
  }

  protected placePieceOnSquare(square: BoardSquare<TPiece>, pieceSymbol: PieceSymbol): void {
    const piece = new Piece(pieceSymbol, square) as TPiece;
    square.placePiece(piece);
  }

  public changeNextPlayerOrEnd(): void {
    const nextPlayer = this.findNextPlayer();

    if (nextPlayer) {
      this.activePlayer = nextPlayer;
      return;
    }

    this.end();
  }

  private findNextPlayer(): TPlayer | null {
    return this.playersAfterActive.find((who) => this.playerCanPlacePiece(who)) || null;
  }

  private get playersAfterActive(): TPlayer[] {
    const activePlayerIndex = Piece.AllSymbols.indexOf(this.activePlayer.pieceSymbol);
    return this.players.slice(activePlayerIndex + 1).concat(this.players.slice(0, activePlayerIndex));
  }

  private playerCanPlacePiece(player: TPlayer): boolean {
    return this.board.squares.some((square) => this.squareCanPlace(square, player.pieceSymbol));
  }

  private end(): void {
    if (this.playerCanPlacePiece(this.activePlayer)) {
      this.winner = this.activePlayer;
    }

    this.ended = true;
  }

  protected squareCanPlace(square: BoardSquare<TPiece>, _pieceSymbol: PieceSymbol): boolean {
    return !square.piece;
  }

  public get allPlayersHavePiece(): boolean {
    return (this._allPlayersHavePiece ||= this.players.every((player) => this.playerHasPlaced(player)));
  }

  private playerHasPlaced(player: TPlayer): boolean {
    return this.board.pieces.some((piece) => piece.symbol === player.pieceSymbol);
  }
}
