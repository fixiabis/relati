import { Piece } from "./piece";
import { Position } from "./position";
import { Square } from "./square";

export class Board {
  public readonly width: number;
  public readonly height: number;
  public readonly squares: Square[][];

  constructor(width: number, height: number, squares: Square[][]) {
    this.width = width;
    this.height = height;
    this.squares = squares;

    this.squares.flat().forEach((square) => (square.board = this));

    Board.validate(this);
  }

  public squareAt(position: Position): Square {
    this.validatePosition(position);
    return this.squares[position.y]![position.x]!;
  }

  public isValidPosition(position: Position): boolean {
    return position.x >= 0 && position.y >= 0 && position.x < this.width && position.y < this.height;
  }

  public validatePosition(position: Position): void {
    if (!this.isValidPosition(position)) {
      throw new BoardValidationError("Position is out of bounds");
    }
  }

  public static create(width: number, height: number = width, pieces: (Piece | null)[][] = []) {
    const squares = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => createSquare(x, y, pieces?.[y]?.[x] || null))
    );

    return new Board(width, height, squares);
  }

  private static validate(board: Board): void {
    if (!isFinite(board.width) || !isFinite(board.height)) {
      throw new InvalidBoardError("Board width and height must be finite numbers");
    }

    if (board.width < 1 || board.height < 1) {
      throw new InvalidBoardError("Board must have at least one square");
    }

    if (board.squares.length !== board.height) {
      throw new InvalidBoardError("Board height does not match number of rows");
    }

    if (board.squares.some((columns) => columns.length !== board.width)) {
      throw new InvalidBoardError("Board width does not match number of columns");
    }

    const squaresMatchPosition = board.squares.every((columns, y) =>
      columns.every((square, x) => square.position.x === x && square.position.y === y)
    );

    if (!squaresMatchPosition) {
      throw new InvalidBoardError("Board squares do not match position");
    }
  }
}

function createSquare(x: number, y: number, piece: Piece | null): Square {
  const position = Position.create(x, y);
  return Square.create(position, piece);
}

export class InvalidBoardError extends Error {}

InvalidBoardError.prototype.name = "InvalidBoardError";

export class BoardValidationError extends Error {}

BoardValidationError.prototype.name = "BoardValidationError";
