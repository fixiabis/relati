import { Board } from "./board";
import { Direction } from "./direction";
import { Piece } from "./piece";
import { Position } from "./position";

export class Square {
  public board!: Board;
  public readonly position: Position;
  public piece: Piece | null;

  constructor(position: Position, piece: Piece | null) {
    this.position = position;
    this.piece = piece;
  }

  public placePiece(piece: Piece): void {
    this.piece = piece;
  }

  public squareTo(direction: Direction): Square {
    return this.board.squareAt(this.position.to(direction));
  }

  public static create(position: Position, piece: Piece | null): Square {
    return new Square(position, piece);
  }
}
