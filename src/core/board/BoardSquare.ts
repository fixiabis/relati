import { Position } from '../vectors/Position';
import { Vector } from '../vectors/Vector';
import { Board } from './Board';
import { Piece } from '../Piece';

export class BoardSquare {
  public readonly position: Position;
  public readonly board: Board;
  private _piece!: Piece | null;

  constructor(position: Position, board: Board) {
    this.position = position;
    this.board = board;
    this.piece = null;
  }

  public squareDefinedTo(direction: Vector): boolean {
    return this.board.squareDefinedAt(this.position.to(direction));
  }

  public squareTo(direction: Vector): BoardSquare {
    return this.board.squareAt(this.position.to(direction));
  }

  public placePiece(piece: Piece): void {
    this.piece = piece;
  }

  public toString(): string {
    return this.piece?.toString() || '   ';
  }

  public get piece(): Piece | null {
    return this._piece;
  }

  private set piece(value: Piece | null) {
    this._piece = value;
  }
}
