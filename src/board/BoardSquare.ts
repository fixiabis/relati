import { BoardSquareException } from "../exceptions/board";
import { Position } from "../positional/Position";
import { Vector2 } from "../positional/Vector2";
import { Board } from "./Board";

export class BoardSquare<TPiece extends {}> {
  public readonly position: Position;
  public readonly board: Board<TPiece>;
  private _piece!: TPiece | null;

  constructor(position: Position, board: Board<TPiece>) {
    this.position = position;
    this.board = board;
    this.piece = null;
  }

  public squareTo(direction: Vector2): BoardSquare<TPiece> {
    if (!this.squareDefinedTo(direction)) {
      throw new BoardSquareException(`Square at "${this.position}" not defined to "${direction}"`);
    }

    return this.squareToDirectly(direction);
  }

  public squareDefinedTo(direction: Vector2): boolean {
    return this.board.squareDefinedAt(this.position.toDirectly(direction));
  }

  public squareToDirectly(direction: Vector2): BoardSquare<TPiece> {
    return this.board.squareAt(this.position.toDirectly(direction));
  }

  public placePiece(piece: TPiece): void {
    this.piece = piece;
  }

  public toString(): string {
    return (this.piece?.toString() || " ").padEnd(2, " ").padStart(3, " ");
  }

  public get piece(): TPiece | null {
    return this._piece;
  }

  private set piece(piece: TPiece | null) {
    this._piece = piece;
  }
}
