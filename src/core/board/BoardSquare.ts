import { Position } from '../vectors/Position';
import { Vector } from '../vectors/Vector';
import { Direction } from '../vectors/Direction';
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
    return this.position.validTo(direction) && this.board.squareDefinedAt(this.position.to(direction));
  }

  public squareTo(direction: Vector): BoardSquare {
    if (!this.squareDefinedTo(direction)) {
      throw new Error(`格子未定義從: ${Position.stringify(this.position)}, 朝向: ${Direction.stringify(direction)}`);
    }

    return this.board.squareAt(this.position.to(direction));
  }

  public placePiece(piece: Piece): void {
    this.piece = piece;
  }

  public get piece(): Piece | null {
    return this._piece;
  }

  private set piece(value: Piece | null) {
    if (this._piece) {
      throw new Error(`格子已被放置棋子: ${Position.stringify(this.position)}`);
    }

    this._piece = value;
  }
}
