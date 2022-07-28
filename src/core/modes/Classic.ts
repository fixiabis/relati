import { Board } from '../board/Board';
import { BoardSquare } from '../board/BoardSquare';
import { Game } from '../Game';
import { Piece, PieceSymbol } from '../Piece';
import { Direction } from '../vectors/Direction';
import { GameMode } from './GameMode';

export class Classic extends GameMode {
  public static readonly NearbyDirections = ['F', 'B', 'L', 'R', 'FL', 'FR', 'BL', 'BR'].map(Direction.parse);

  public createBoard(numberOfPlayers: number): Board<Piece> {
    return new Board(numberOfPlayers * 2 + 1);
  }

  public placePieceOnSquare(game: Game, pieceSymbol: PieceSymbol, square: BoardSquare<any>): void {
    if (game.allPlayersHavePlaced && !anySimilarPieceNearby(square, pieceSymbol)) {
      throw new Error('無法聯繫到附近的符號');
    }

    const piece = new Piece(pieceSymbol, square);
    square.placePiece(piece);
  }

  public squareCanPlace(game: Game, square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    return square.piece === null && (!game.allPlayersHavePlaced || anySimilarPieceNearby(square, pieceSymbol));
  }
}

function anySimilarPieceNearby(square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
  return findNearbyPieces(square).some((nearbyPiece) => nearbyPiece.symbol === pieceSymbol);
}

function findNearbyPieces(square: BoardSquare): Piece[] {
  return Classic.NearbyDirections.filter((direction) => square.squareDefinedTo(direction))
    .map((direction) => square.squareTo(direction).piece)
    .filter(Boolean);
}
