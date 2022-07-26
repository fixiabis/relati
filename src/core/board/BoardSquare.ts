import { PositionCoordinate } from '../coordinates/PositionCoordinate';
import { Coordinate } from '../coordinates/Coordinate';
import { DirectionCoordinate } from '../coordinates/DirectionCoordinate';
import { Board } from './Board';

export class BoardSquare<TPiece = any> {
  public readonly position: PositionCoordinate;
  public readonly board: Board<TPiece>;
  private _piece!: TPiece | null;

  constructor(coordinate: PositionCoordinate, board: Board<TPiece>) {
    this.position = coordinate;
    this.board = board;
    this.piece = null;
  }

  public squareDefinedTo(direction: Coordinate): boolean {
    return this.board.squareDefinedAt(this.position.to(direction));
  }

  public squareTo(direction: Coordinate): BoardSquare<TPiece> {
    try {
      return this.board.squareAt(this.position.to(direction));
    } catch {
      throw new Error(
        `格子未定義從: ${PositionCoordinate.stringify(this.position)}, 朝向: ${DirectionCoordinate.stringify(
          direction
        )}`
      );
    }
  }

  public placePiece(piece: TPiece): void {
    if (this.piece) {
      throw new Error(`格子已被放置棋子: ${PositionCoordinate.stringify(this.position)}`);
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
