import { BoardSquare } from "../board/BoardSquare";
import { Piece } from "./Piece";

export class PieceRelation {
  public readonly endingSquare: BoardSquare<Piece>;
  public readonly passingSquares: BoardSquare<Piece>[];
  public readonly startingSquare: BoardSquare<Piece>;

  constructor(
    endingSquare: BoardSquare<Piece>,
    passingSquares: BoardSquare<Piece>[],
    startingSquare: BoardSquare<Piece>
  ) {
    this.endingSquare = endingSquare;
    this.passingSquares = passingSquares;
    this.startingSquare = startingSquare;
  }

  public get sender(): Piece | null {
    return this.startingSquare.piece;
  }

  public get receiver(): Piece | null {
    return this.endingSquare.piece;
  }

  public get blocked(): boolean {
    return this.passingSquares.some((square) => square.piece);
  }
}
