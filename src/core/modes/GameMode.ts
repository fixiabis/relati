import { Board } from '../board/Board';
import { BoardSquare } from '../board/BoardSquare';
import { Game } from '../Game';
import { Piece, PieceSymbol } from '../Piece';

export abstract class GameMode {
  public abstract createBoard(numberOfPlayers: number): Board<Piece>;

  public abstract placePieceOnSquare(game: Game, pieceSymbol: PieceSymbol, square: BoardSquare): void;

  public abstract squareCanPlace(game: Game, square: BoardSquare, pieceSymbol: PieceSymbol): boolean;
}
