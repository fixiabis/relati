import { BoardSquare } from '../../board';
import { Game, ModernGame } from '../../games/proto-1';
import { Piece, PieceSymbol } from '../../piece';

const doNothing = () => {};

export abstract class Player<TGame extends Game> {
  public readonly pieceSymbol: PieceSymbol;
  public onTurned: (game: TGame) => void;

  constructor(pieceSymbol: PieceSymbol) {
    this.pieceSymbol = pieceSymbol;
    this.onTurned = doNothing;
  }

  public createPiece(square: BoardSquare, game: TGame): Piece {
    if (this.isModernGame(game)) {
      return this.createPieceForModern(square, game);
    }

    return new Piece(this.pieceSymbol, square);
  }

  private createPieceForModern(square: BoardSquare, game: ModernGame): Piece {
    const isRoot = !game.allRootPlaced;
    const relationPaths = game.relationMode.createPaths(square);
    return new Piece(this.pieceSymbol, square, { isRoot, relationPaths });
  }

  private isModernGame(game: Game): game is ModernGame {
    return game.hasOwnProperty('relationMode') && game.hasOwnProperty('rootPlacing');
  }
}
