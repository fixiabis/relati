import { BoardSquare } from '../core/board/BoardSquare';
import { Game } from '../core/Game';
import { Piece } from '../core/Piece';
import { Player } from '../core/Player';
import { NearbyDirections } from './NearbyDirections';

export class ClassicGame extends Game<Piece> {
  protected override placePieceOnSquare(player: Player<Piece>, square: BoardSquare<Piece>): void {
    if (this.canPlacePieceOnSquare(player, square)) {
      throw new Error(`Can't place piece on square: ${square.position}`);
    }

    super.placePieceOnSquare(player, square);
  }

  protected canPlacePieceOnSquare(player: Player<Piece>, square: BoardSquare<Piece>): boolean {
    return NearbyDirections.filter((direction) => square.squareDefinedTo(direction))
      .map((direction) => square.squareTo(direction).piece)
      .some((relatedPiece) => relatedPiece?.symbol === player.pieceSymbol);
  }

  protected override findNextPlayer(): Player<Piece> | null {
    const activePlayerIndex = this.players.indexOf(this.activePlayer);

    const playersAfterActivePlayer = this.players
      .slice(activePlayerIndex + 1)
      .concat(this.players.slice(0, activePlayerIndex));

    return playersAfterActivePlayer.find((who) => this.playerCanPlacePiece(who)) || null;
  }

  private playerCanPlacePiece(player: Player<Piece>): boolean {
    return this.board.squareList.some((square) => !square.piece && this.canPlacePieceOnSquare(player, square));
  }
}
