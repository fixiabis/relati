import { Board } from './board/Board';
import { BoardSquare } from './board/BoardSquare';
import { Piece, PieceSymbol } from './Piece';
import { Player } from './Player';
import { Position, PositionCode } from './primitives/Position';

export interface GameInit<_Piece extends Piece, TPlayer extends Player> {
  ended?: boolean;
  winner?: TPlayer | null;
  activePlayer?: TPlayer;
}

export class Game<TPiece extends Piece, TPlayer extends Player> {
  public readonly players: readonly TPlayer[];
  public readonly board: Board<TPiece>;
  public activePlayer: TPlayer;
  public ended: boolean;
  public winner: TPlayer | null;

  constructor(players: TPlayer[], board: Board<TPiece>, init: GameInit<TPiece, TPlayer> = {}) {
    this.players = players;
    this.board = board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
  }

  public placePiece(pieceSymbol: PieceSymbol, positionCode: PositionCode): void {
    const position = Position.parse(positionCode);
    const square = this.board.squareAt(position);
    const piece = this.createPiece(pieceSymbol, square);
    this.placePieceOnSquare(piece, square);
  }

  protected createPiece(pieceSymbol: PieceSymbol, square: BoardSquare<TPiece>): TPiece {
    return new Piece(pieceSymbol, square) as TPiece;
  }

  protected placePieceOnSquare(piece: TPiece, square: BoardSquare<TPiece>): void {
    square.placePiece(piece);
  }
}
