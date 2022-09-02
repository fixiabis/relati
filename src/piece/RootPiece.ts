import { BoardSquare } from "../board/BoardSquare";
import { Piece, PieceInit, PieceSymbol } from "./Piece";

export class RootPiece extends Piece {
  constructor(symbol: PieceSymbol, square: BoardSquare<Piece>, init: PieceInit = {}) {
    super(symbol, square, { ...init, isRoot: true });
  }

  public override get disabled(): boolean {
    return false;
  }

  public override receiveRelation(): void {}
}
