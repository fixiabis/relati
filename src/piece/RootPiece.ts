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

  public sendRelation(): void {
    const senders: Piece[] = [this];

    for (const sender of senders) {
      for (const relation of sender.relations) {
        if (!relation.blocked && relation.receiver?.symbol === this.symbol && relation.receiver.disabled) {
          relation.receiver.receiveRelation(relation);
          senders.push(relation.receiver);
        }
      }
    }
  }
}
