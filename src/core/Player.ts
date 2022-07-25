import { BoardSquare } from './board/BoardSquare';
import { Game } from './Game';
import { Piece, PieceSymbol } from './Piece';

export class Player<TPiece extends Piece> {
  public readonly pieceSymbol: PieceSymbol;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
  }

  public createPiece(square: BoardSquare<TPiece>, _game: Game<TPiece>): TPiece {
    return new Piece(this.pieceSymbol, square) as TPiece;
  }

  public toString(): PieceSymbol {
    return this.pieceSymbol;
  }
}
