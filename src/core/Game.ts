import { Board } from './board/Board';
import { BoardSquare } from './board/BoardSquare';
import { GameMode } from './modes/GameMode';
import { Piece, PieceSymbol } from './Piece';
import { Player } from './Player';
import { Position, PositionCode } from './vectors/Position';

export interface GameInit {
  mode: GameMode;
  board?: Board;
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player;
  movedInTurn?: boolean;
}

export class Game {
  public readonly players: readonly Player[];
  public readonly mode: GameMode;
  public readonly board: Board;
  public hasMoveInTurn: boolean;
  public ended: boolean;
  public winner: Player | null;
  private _activePlayer!: Player;
  private _rootPieces?: Partial<Record<PieceSymbol, Piece>>;
  private _allPlayerHavePlaced?: boolean;

  constructor(players: Player[], init: GameInit) {
    this.players = players;
    this.mode = init.mode;
    this.board = init.board || new Board(...init.mode.calcBoardSize(players.length));
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this.hasMoveInTurn = init.movedInTurn || false;
  }

  public placePiece(pieceSymbol: PieceSymbol, positionCode: PositionCode) {
    this.validateCanPlacePiece(pieceSymbol, positionCode);

    const position = Position.parse(positionCode);
    const square = this.boardSquareAt(position);

    this.mode.placePieceOnSquare(this, pieceSymbol, square);
    this.endMove();
  }

  private validateCanPlacePiece(pieceSymbol: PieceSymbol, positionCode: PositionCode): void {
    this.validateCanMove(pieceSymbol);

    if (!Position.isParsableCode(positionCode)) {
      throw new Error('無法解析的位置');
    }
  }

  private boardSquareAt(position: Position): BoardSquare {
    if (!this.board.squareDefinedAt(position)) {
      throw new Error('不存在的格子');
    }

    const square = this.board.squareAt(position);

    if (square.piece) {
      throw new Error(`格子${position}已有棋子`);
    }

    return square;
  }

  public abandonRemainingMoves(pieceSymbol: PieceSymbol): void {
    this.validateCanMove(pieceSymbol);
    this.mode.abandonRemainingMoves(this);
    this.endMove();
  }

  private validateCanMove(pieceSymbol: PieceSymbol): void {
    if (pieceSymbol !== this.activePlayer.pieceSymbol) {
      throw new Error('非玩家回合的符號');
    }
  }

  private endMove() {
    this.hasMoveInTurn = true;
    this.activePlayer.movesRemaining--;

    if (!this.activePlayer.movesRemaining) {
      this.nextPlayerTurnOrEnd();
      this.hasMoveInTurn = false;
    }
  }

  private nextPlayerTurnOrEnd(): void {
    const nextPlayer = this.findNextPlayer();

    if (nextPlayer) {
      this.activePlayer = nextPlayer;
      return;
    }

    if (this.playerCanPlacePiece(this.activePlayer)) {
      this.winner = this.activePlayer;
    }

    this.ended = true;
  }

  private findNextPlayer(): Player | null {
    return this.playersAfterActive.find((who) => this.playerCanPlacePiece(who)) || null;
  }

  private get playersAfterActive(): Player[] {
    const activePlayerIndex = this.players.indexOf(this.activePlayer);
    return this.players.slice(activePlayerIndex + 1).concat(this.players.slice(0, activePlayerIndex));
  }

  private playerCanPlacePiece(player: Player): boolean {
    return this.board.squareList.some((square) => this.mode.squareCanPlace(this, square, player.pieceSymbol));
  }

  public get allPlayersHavePlaced(): boolean {
    return (this._allPlayerHavePlaced ||= this.players.every((player) => this.playerHasPlaced(player)));
  }

  public playerHasPlaced(player: Player): boolean {
    return this.board.pieces.some((piece) => piece.symbol === player.pieceSymbol);
  }

  public get rootPieces(): Partial<Record<PieceSymbol, Piece>> {
    const rootPieces = this._rootPieces || this.findRootPieces();

    if (!this._rootPieces && Object.keys(rootPieces).length === this.players.length) {
      this._rootPieces = rootPieces;
    }

    return rootPieces;
  }

  private findRootPieces(): Partial<Record<PieceSymbol, Piece>> {
    const rootPieces = {} as Partial<Record<PieceSymbol, Piece>>;

    for (const square of this.board.squareList) {
      if (square.piece?.isRoot) {
        rootPieces[square.piece.symbol] = square.piece;
      }
    }

    return rootPieces;
  }

  public get activePlayer(): Player {
    return this._activePlayer;
  }

  public set activePlayer(player: Player) {
    player.movesRemaining = 1;
    this._activePlayer = player;
  }
}
