import { BoardSquarePath } from "../board/BoardSquarePath";
import { Piece } from "./Piece";

export class PieceRelation {
  public readonly squarePath: BoardSquarePath<Piece>;

  constructor(squarePath: BoardSquarePath<Piece>) {
    this.squarePath = squarePath;
  }

  public get sender(): Piece | null {
    return this.squarePath.startingSquare.piece;
  }

  public get receiver(): Piece | null {
    return this.squarePath.endingSquare.piece;
  }

  public get blocked(): boolean {
    return this.squarePath.passingSquares.some((square) => square.piece);
  }
}
