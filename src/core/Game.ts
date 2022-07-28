import { Board } from './board/Board';
import { BoardSquare } from './board/BoardSquare';
import { Direction } from './vectors/Direction';
import { PositionCode, Position } from './vectors/Position';
import { Piece, PieceSymbol } from './Piece';
import { Player } from './Player';

const NearbyDirections = ['F', 'B', 'L', 'R', 'FL', 'FR', 'BL', 'BR'].map(Direction.parse);

export interface GameInit {
  board: Board<Piece>;
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player;
}

export class Game {
  public readonly players: readonly Player[];
  public readonly board: Board<Piece>;
  public ended: boolean;
  public winner: Player | null;
  public activePlayer: Player;
  private _allPlayerHavePlaced!: boolean;

  constructor(players: Player[], init: GameInit) {
    this.players = players;
    this.board = init.board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
  }

  public placePiece(pieceSymbol: PieceSymbol, positionCode: PositionCode) {
    this.validateIsPieceSymbolOfActivePlayer(pieceSymbol);

    const position = Position.parse(positionCode);
    const square = this.board.squareAt(position);

    this.placePieceOnSquare(pieceSymbol, square);
    this.nextPlayerTurnOrEnd();
  }

  private validateIsPieceSymbolOfActivePlayer(pieceSymbol: PieceSymbol): void {
    if (pieceSymbol !== this.activePlayer.pieceSymbol) {
      throw new Error('符號非該玩家的回合');
    }
  }

  private placePieceOnSquare(pieceSymbol: PieceSymbol, square: BoardSquare): void {
    if (this.allPlayersHavePlaced && !this.anySimilarPieceNearby(square, pieceSymbol)) {
      throw new Error('無法聯繫到附近的符號');
    }

    const piece = new Piece(pieceSymbol, square);
    square.placePiece(piece);
  }

  private anySimilarPieceNearby(square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    return this.findNearbyPieces(square).some((nearbyPiece) => nearbyPiece.symbol === pieceSymbol);
  }

  private findNearbyPieces(square: BoardSquare): Piece[] {
    return NearbyDirections.filter((direction) => square.squareDefinedTo(direction))
      .map((direction) => square.squareTo(direction).piece)
      .filter(Boolean);
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
    return this.board.squareList.some((square) => this.squareCanPlace(square, player.pieceSymbol));
  }

  private squareCanPlace(square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    return square.piece === null && (!this.allPlayersHavePlaced || this.anySimilarPieceNearby(square, pieceSymbol));
  }

  public get allPlayersHavePlaced(): boolean {
    return (this._allPlayerHavePlaced ||= this.players.every((player) => this.playerHasPlaced(player)));
  }

  public playerHasPlaced(player: Player): boolean {
    return this.board.pieces.some((piece) => piece.symbol === player.pieceSymbol);
  }
}
