import { Board, ReadonlyBoard } from "../core/Board";
import { BoardSquare } from "../core/BoardSquare";
import { Direction } from "../core/Direction";
import { Piece, PieceSymbol } from "../core/Piece";
import { Player } from "../core/Player";
import { Position, PositionCode } from "../core/Position";

export interface ClassicGameState {
  board: Board<Piece>;
  activePlayer: Player;
  winner: Player | null;
  ended: boolean;
}

export class ClassicGame {
  public static readonly NearbyDirections = ["F", "B", "L", "R", "FL", "FR", "BL", "BR"].map(Direction.parse);

  public readonly players: readonly Player[];
  private state: ClassicGameState;
  private _allPlayersHavePiece?: boolean;

  constructor(players: Player[], state?: ClassicGameState) {
    this.players = players;
    this.state = state || ClassicGame.createInitialState(players);
  }

  public placePiece(pieceSymbol: PieceSymbol, positionCode: PositionCode): void {
    this.validateCanPlacePiece(pieceSymbol, positionCode);
    const position = this.parsePosition(positionCode);
    const square = this.boardSquareAt(position);
    const piece = new Piece(pieceSymbol, square);
    this.placePieceOnSquare(square, piece);
    this.nextPlayerTurnOrEnd();
  }

  private validateCanPlacePiece(pieceSymbol: PieceSymbol, _positionCode: PositionCode): void {
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

  private boardSquareAt(position: Position): BoardSquare<Piece> {
    if (!this.state.board.squareDefinedAt(position)) {
      throw new Error("不存在的格子");
    }

    return this.state.board.squareAt(position);
  }

  private placePieceOnSquare(square: BoardSquare<Piece>, piece: Piece): void {
    if (square.piece) {
      throw new Error(`格子${square.position}已有棋子`);
    }

    if (this.allPlayersHavePiece && !this.anySimilarPieceNearby(square, piece.symbol)) {
      throw new Error(`格子${square.position}無法聯繫到附近的符號`);
    }

    square.placePiece(piece);
  }

  private nextPlayerTurnOrEnd(): void {
    const nextPlayer = this.findNextPlayer();

    if (nextPlayer) {
      this.state.activePlayer = nextPlayer;
      return;
    }

    this.end();
  }

  private findNextPlayer(): Player | null {
    return this.playersAfterActive.find((who) => this.playerCanPlacePiece(who)) || null;
  }

  private get playersAfterActive(): Player[] {
    const activePlayerIndex = Piece.AllSymbols.indexOf(this.activePlayer.pieceSymbol);
    return this.players.slice(activePlayerIndex + 1).concat(this.players.slice(0, activePlayerIndex));
  }

  private playerCanPlacePiece(player: Player): boolean {
    return this.state.board.squareList.some((square) => this.squareCanPlace(square, player.pieceSymbol));
  }

  private end(): void {
    if (this.playerCanPlacePiece(this.activePlayer)) {
      this.state.winner = this.activePlayer;
    }

    this.state.ended = true;
  }

  private squareCanPlace(square: BoardSquare<Piece>, pieceSymbol: PieceSymbol): boolean {
    return !square.piece && (!this.allPlayersHavePiece || this.anySimilarPieceNearby(square, pieceSymbol));
  }

  private anySimilarPieceNearby(square: BoardSquare<Piece>, pieceSymbol: PieceSymbol): boolean {
    return this.findNearbyPieces(square).some((nearbyPiece) => nearbyPiece.symbol === pieceSymbol);
  }

  private findNearbyPieces(square: BoardSquare<Piece>): Piece[] {
    return ClassicGame.NearbyDirections.filter((direction) => square.squareDefinedTo(direction))
      .map((direction) => square.squareTo(direction).piece!)
      .filter(Boolean);
  }

  public get board(): ReadonlyBoard<Piece> {
    return this.state.board as ReadonlyBoard<Piece>;
  }

  public get activePlayer(): Readonly<Player> {
    return this.state.activePlayer;
  }

  public get winner(): Readonly<Player> | null {
    return this.state.winner;
  }

  public get ended(): boolean {
    return this.state.ended;
  }

  public get allPlayersHavePiece(): boolean {
    return (this._allPlayersHavePiece ||= this.players.every((player) => this.playerHasPlaced(player)));
  }

  private playerHasPlaced(player: Player): boolean {
    return this.board.pieces.some((piece) => piece.symbol === player.pieceSymbol);
  }

  private static createInitialState(players: Player[]): ClassicGameState {
    return {
      board: new Board<Piece>(players.length * 2 + 1),
      activePlayer: players[0]!,
      winner: null,
      ended: false,
    };
  }
}