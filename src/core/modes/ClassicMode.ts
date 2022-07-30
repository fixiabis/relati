import { BoardSquare } from '../board/BoardSquare';
import { Game } from '../Game';
import { Piece, PieceSymbol } from '../Piece';
import { Direction } from '../primitives/Direction';
import { GameMode } from './GameMode';

export class ClassicMode extends GameMode {
  public static readonly NearbyDirections = ['F', 'B', 'L', 'R', 'FL', 'FR', 'BL', 'BR'].map(Direction.parse);

  public calcBoardSize(numberOfPlayers: number): [width: number, height?: number] {
    return [numberOfPlayers * 2 + 1];
  }

  public placePieceOnSquare(game: Game, pieceSymbol: PieceSymbol, square: BoardSquare): void {
    if (game.allPlayersHavePlaced && !this.anySimilarPieceNearby(square, pieceSymbol)) {
      throw new Error(`格子${square.position}無法聯繫到附近的符號`);
    }

    const piece = new Piece(pieceSymbol, square);
    square.placePiece(piece);
  }

  private anySimilarPieceNearby(square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    return this.findNearbyPieces(square).some((nearbyPiece) => nearbyPiece.symbol === pieceSymbol);
  }

  private findNearbyPieces(square: BoardSquare): Piece[] {
    return ClassicMode.NearbyDirections.filter((direction) => square.squareDefinedTo(direction))
      .map((direction) => square.squareTo(direction).piece!)
      .filter(Boolean);
  }

  public squareCanPlace(game: Game, square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    return !square.piece && (!game.allPlayersHavePlaced || this.anySimilarPieceNearby(square, pieceSymbol));
  }
}
