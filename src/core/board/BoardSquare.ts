import { Position } from '../vectors/Position';
import { Vector } from '../vectors/Vector';
import { Direction } from '../vectors/Direction';
import { Board } from './Board';

export class BoardSquare<TPiece = any> {
  public readonly position: Position;
  public readonly board: Board<TPiece>;
  private _piece!: TPiece | null;

  constructor(position: Position, board: Board<TPiece>) {
    this.position = position;
    this.board = board;
    this.piece = null;
  }

  public squareDefinedTo(direction: Vector): boolean {
    return this.position.validTo(direction) && this.board.squareDefinedAt(this.position.to(direction));
  }

  public squareTo(direction: Vector): BoardSquare<TPiece> {
    try {
      return this.board.squareAt(this.position.to(direction));
    } catch {
      throw new Error(`格子未定義從: ${Position.stringify(this.position)}, 朝向: ${Direction.stringify(direction)}`);
    }
  }

  public placePiece(piece: TPiece): void {
    if (this.piece) {
      throw new Error(`格子已被放置棋子: ${Position.stringify(this.position)}`);
    }

    this.piece = piece;
  }

  public get piece(): TPiece | null {
    return this._piece;
  }

  private set piece(value: TPiece | null) {
    this._piece = value;
  }
}
