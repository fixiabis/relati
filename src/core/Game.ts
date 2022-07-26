import { Board } from './board/Board';
import { BoardSquare } from './board/BoardSquare';
import { DirectionCoordinate } from './coordinates/DirectionCoordinate';
import { Position, PositionCoordinate } from './coordinates/PositionCoordinate';
import { Piece, PieceSymbol } from './Piece';
import { Player } from './Player';

const NearbyDirections = ['F', 'B', 'L', 'R', 'FL', 'FR', 'BL', 'BR'].map(DirectionCoordinate.parse);

export interface GameInit {
  board: Board<Piece>;
  ended?: boolean;
  winner?: Player | null;
  activePlayer?: Player;
  allPlayersHavePlaced?: boolean;
}

export class Game {
  public readonly players: readonly Player[];
  public readonly board: Board<Piece>;
  public ended: boolean;
  public winner: Player | null;
  public activePlayer: Player;
  public allPlayersHavePlaced: boolean;

  constructor(players: Player[], init: GameInit) {
    this.players = players;
    this.board = init.board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this.allPlayersHavePlaced = init.allPlayersHavePlaced || false;
  }

  public placePiece(pieceSymbol: PieceSymbol, position: Position) {
    if (pieceSymbol !== this.activePlayer.pieceSymbol) {
      throw new Error('符號非該玩家的回合');
    }

    const positionCoordinate = PositionCoordinate.parse(position);
    const square = this.board.squareAt(positionCoordinate);

    this.placePieceOnSquare(pieceSymbol, square);
    this.checkAllPlayersHavePlaced();
    this.nextPlayerTurnOrEnd();
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

  private checkAllPlayersHavePlaced(): void {
    if (!this.allPlayersHavePlaced && this.activePlayer === this.players[this.players.length - 1]) {
      this.allPlayersHavePlaced = true;
    }
  }

  private nextPlayerTurnOrEnd(): void {
    const activePlayerIndex = this.players.indexOf(this.activePlayer);

    const playersAfterActive = this.players
      .slice(activePlayerIndex + 1)
      .concat(this.players.slice(0, activePlayerIndex));

    const nextPlayer = this.findNextPlayer(playersAfterActive);

    if (nextPlayer) {
      this.activePlayer = nextPlayer;
      return;
    }

    if (this.anySquarePlayerCanPlace(this.activePlayer)) {
      this.winner = this.activePlayer;
    }

    this.ended = true;
  }

  private findNextPlayer(players: Player[]): Player | null {
    return players.find((who) => this.anySquarePlayerCanPlace(who)) || null;
  }

  private anySquarePlayerCanPlace(player: Player): boolean {
    return this.board.squareList.some((square) => this.squareCanPlace(square, player.pieceSymbol));
  }

  private squareCanPlace(square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    return square.piece === null && (!this.allPlayersHavePlaced || this.anySimilarPieceNearby(square, pieceSymbol));
  }
}
