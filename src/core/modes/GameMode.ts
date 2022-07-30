import { BoardSquare } from '../board/BoardSquare';
import { Game } from '../Game';
import { PieceSymbol } from '../piece/Piece';

export abstract class GameMode {
  public abstract calcBoardSize(numberOfPlayers: number): [width: number, height?: number];

  public abstract placePieceOnSquare(game: Game, pieceSymbol: PieceSymbol, square: BoardSquare): void;

  public abandonRemainingMoves(_game: Game): void {
    throw new Error('無法在此模式放棄移動');
  }

  public abstract squareCanPlace(game: Game, square: BoardSquare, pieceSymbol: PieceSymbol): boolean;
}
