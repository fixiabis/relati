import { Board } from './board/Board';
import { BoardSquare } from './board/BoardSquare';
import { GameMode } from './modes/GameMode';
import { Piece, PieceSymbol } from './Piece';
import { ActivePlayer } from './players/ActivePlayer';
import { Player } from './players/Player';
import { Position, PositionCode } from './primitives/Position';

export interface GameInit {
  board?: Board;
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: ActivePlayer;
}

export class Game {
  public readonly mode: GameMode;
  public readonly players: readonly Player[];
  public readonly board: Board;
  public readonly activePlayer: ActivePlayer;
  public ended: boolean;
  public winner: Player | null;
  private _allPlayerHavePlaced?: boolean;

  constructor(mode: GameMode, players: Player[], init: GameInit = {}) {
    this.mode = mode;
    this.players = players;
    this.board = init.board || new Board(...mode.calcBoardSize(players.length));
    this.activePlayer = init.activePlayer || new ActivePlayer(players[0]!);
    this.winner = init.winner || null;
    this.ended = init.ended || false;
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

  private endMove(): void {
    this.activePlayer.endMove();

    if (!this.activePlayer.movesRemaining) {
      this.nextPlayerTurnOrEnd();
    }
  }

  private nextPlayerTurnOrEnd(): void {
    const nextPlayer = this.findNextPlayer();

    if (nextPlayer) {
      this.activePlayer.turnTo(nextPlayer);
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
    const activePlayerIndex = Piece.AllSymbols.indexOf(this.activePlayer.pieceSymbol);
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
}
