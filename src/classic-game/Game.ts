import { Board } from "../core-1/Board";
import { BoardSquare } from "../core-1/BoardSquare";
import { Direction } from "../core-1/Direction";
import { Game } from "../core-1/Game";
import { Piece, PieceSymbol } from "../core-1/Piece";
import { Player } from "../core-1/Player";

export class ClassicGame extends Game<Piece, Player> {
  public static readonly NearbyDirections = ["F", "B", "L", "R", "FL", "FR", "BL", "BR"].map(Direction.parse);

  protected override createBoard(players: Player[]): Board<Piece> {
    return new Board(players.length * 2 + 1);
  }

  protected override placePieceOnSquare(square: BoardSquare<Piece>, pieceSymbol: PieceSymbol): void {
    if (this.allPlayersHavePiece && !this.anySimilarPieceNearby(square, pieceSymbol)) {
      throw new Error(`格子${square.position}無法聯繫到附近的符號`);
    }

    super.placePieceOnSquare(square, pieceSymbol);
  }

  protected override squareCanPlace(square: BoardSquare<Piece>, pieceSymbol: PieceSymbol): boolean {
    return (
      super.squareCanPlace(square, pieceSymbol) &&
      (!this.allPlayersHavePiece || this.anySimilarPieceNearby(square, pieceSymbol))
    );
  }

  private anySimilarPieceNearby(square: BoardSquare<Piece>, pieceSymbol: PieceSymbol): boolean {
    return this.findNearbyPieces(square).some((nearbyPiece) => nearbyPiece.symbol === pieceSymbol);
  }

  private findNearbyPieces(square: BoardSquare<Piece>): Piece[] {
    return ClassicGame.NearbyDirections.filter((direction) => square.squareDefinedTo(direction))
      .map((direction) => square.squareTo(direction).piece!)
      .filter(Boolean);
  }
}
