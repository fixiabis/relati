import { BoardSquare } from '../board';
import { Game } from '../games/Game';
import { Piece, PieceSymbol } from '../piece';

export abstract class Player<TGame extends Game> {
  public readonly pieceSymbol: PieceSymbol;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
  }

  public abstract onTurned(game: TGame): void;

  public createPiece(square: BoardSquare, game: TGame): Piece {
    return new Piece(this.pieceSymbol, square, { isRoot: game.rootPlacing });
  }
}
