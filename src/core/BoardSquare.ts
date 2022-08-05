import { Position } from "./Position";
import { Vector } from "./Vector";
import { Board, ReadonlyBoard } from "./Board";

export class BoardSquare<TPiece extends {}> {
  public readonly position: Position;
  public readonly board: Board<TPiece>;
  private _piece!: TPiece | null;

  constructor(position: Position, board: Board<TPiece>) {
    this.position = position;
    this.board = board;
    this.piece = null;
  }

  public squareDefinedTo(direction: Vector): boolean {
    return this.board.squareDefinedAt(this.position.to(direction));
  }

  public squareTo(direction: Vector): BoardSquare<TPiece> {
    return this.board.squareAt(this.position.to(direction));
  }

  public placePiece(piece: TPiece): void {
    this.piece = piece;
  }

  public toString(): string {
    return this.piece?.toString() || "   ";
  }

  public get piece(): TPiece | null {
    return this._piece;
  }

  private set piece(piece: TPiece | null) {
    this._piece = piece;
  }
}

export interface ReadonlyBoardSquare<TPiece extends {}> extends BoardSquare<TPiece> {
  readonly board: ReadonlyBoard<Readonly<TPiece>>;
  readonly piece: Readonly<TPiece>;
  squareTo(direction: Vector): ReadonlyBoardSquare<Readonly<TPiece>>;
}
