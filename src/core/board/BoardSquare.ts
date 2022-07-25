import { PositionCoordinate } from '../coordinates/PositionCoordinate';
import { Coordinate } from '../coordinates/Coordinate';
import { DirectionCoordinate } from '../coordinates/DirectionCoordinate';
import { Board } from './Board';

export class BoardSquare<TPiece> {
  public readonly position: PositionCoordinate;
  public readonly board: Board<TPiece>;
  private _piece!: TPiece | null;

  constructor(coordinate: PositionCoordinate, board: Board<TPiece>) {
    this.position = coordinate;
    this.board = board;
    this.piece = null;
  }

  public squareDefinedTo(direction: Coordinate): boolean {
    return this.board.squareDefinedAt(this.toPosition(direction));
  }

  public squareTo(direction: Coordinate): BoardSquare<TPiece> {
    try {
      return this.board.squareAt(this.toPosition(direction));
    } catch {
      throw new Error(
        `Square not defined on: ${PositionCoordinate.stringify(this.position)}, got: ${DirectionCoordinate.stringify(
          direction
        )}`
      );
    }
  }

  private toPosition(direction: Coordinate): Coordinate {
    const [x, y] = this.position;
    const [dx, dy] = direction;
    return [x + dx, y + dy];
  }

  public placePiece(piece: TPiece): void {
    if (this.piece) {
      throw new Error(`Square has been taken, can't place piece at: ${PositionCoordinate.stringify(this.position)}`);
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
