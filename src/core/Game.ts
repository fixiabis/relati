import { Board } from './board/Board';
import { PositionCode, Position } from './vectors/Position';
import { Piece, PieceSymbol } from './Piece';
import { Player } from './Player';
import { GameMode } from './modes/GameMode';

export interface GameInit {
  mode: GameMode;
  board?: Board;
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player;
}

export class Game {
  public readonly players: readonly Player[];
  public readonly mode: GameMode;
  public readonly board: Board;
  public ended: boolean;
  public winner: Player | null;
  public activePlayer: Player;
  private _rootPieces?: Partial<Record<PieceSymbol, Piece>>;
  private _allPlayerHavePlaced?: boolean;

  constructor(players: Player[], init: GameInit) {
    this.players = players;
    this.mode = init.mode;
    this.board = init.board || init.mode.createBoard(players.length);
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
  }

  public placePiece(pieceSymbol: PieceSymbol, positionCode: PositionCode) {
    this.validateIsPieceSymbolOfActivePlayer(pieceSymbol);

    const position = Position.parse(positionCode);
    const square = this.board.squareAt(position);

    this.mode.placePieceOnSquare(this, pieceSymbol, square);
    this.nextPlayerTurnOrEnd();
  }

  private validateIsPieceSymbolOfActivePlayer(pieceSymbol: PieceSymbol): void {
    if (pieceSymbol !== this.activePlayer.pieceSymbol) {
      throw new Error('符號非該玩家的回合');
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
    if (this._rootPieces) {
      return this._rootPieces;
    }

    const rootPieces = this.findRootPieces();

    if (Object.keys(rootPieces).length === this.players.length) {
      this._rootPieces = rootPieces;
    }

    return this._rootPieces || rootPieces;
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
}
