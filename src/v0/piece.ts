import { Mark } from "./mark";

export class Piece {
  public readonly mark: Mark;

  constructor(mark: Mark) {
    this.mark = mark;
  }

  public static create(mark: Mark): Piece {
    return new Piece(mark);
  }
}
