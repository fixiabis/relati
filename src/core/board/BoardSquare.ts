import { AbsoluteCoordinate, Coordinate, RelativeCoordinate } from '../coordinates';
import { Piece } from '../piece/Piece';
import { Board } from './Board';

export class BoardSquare {
  public readonly coordinate: AbsoluteCoordinate;
  public readonly board: Board;
  private _piece!: Piece | null;

  constructor(coordinate: AbsoluteCoordinate, board: Board) {
    this.coordinate = coordinate;
    this.board = board;
    this.piece = null;
  }

  public squareDefinedTo(relativeCoordinate: Coordinate): boolean {
    return this.board.squareDefinedAt(this.toCoordinate(relativeCoordinate));
  }

  public squareTo(relativeCoordinate: Coordinate): BoardSquare {
    try {
      return this.board.squareAt(this.toCoordinate(relativeCoordinate));
    } catch {
      throw new Error(`Square not defined to "${RelativeCoordinate.stringify(relativeCoordinate)}"`);
    }
  }

  private toCoordinate(relativeCoordinate: Coordinate): Coordinate {
    const [x, y] = this.coordinate;
    const [dx, dy] = relativeCoordinate;
    return [x + dx, y + dy];
  }

  public placePiece(piece: Piece): void {
    if (this.piece) {
      throw new Error(`Piece can't place at "${AbsoluteCoordinate.stringify(this.coordinate)}", square has been taken`);
    }

    this.piece = piece;
  }

  public get piece(): Piece | null {
    return this._piece;
  }

  private set piece(value: Piece | null) {
    this._piece = value;
  }
}
