import { Piece } from '../Piece';

export type PieceRoleType = string;

export class PieceRole {
  public readonly type: PieceRoleType;

  constructor(type: string) {
    this.type = type;
  }

  public canMove(piece: Piece): boolean {
    return !piece.disabled;
  }

  public canBeTarget(piece: Piece): boolean {
    return Boolean(piece && !piece.dead);
  }

  public onAttacked(piece: Piece): void {
    piece.dead = true;
  }

  public onKilled(piece: Piece): void {
    piece.dead = true;
  }

  public toString(): PieceRoleType {
    return this.type;
  }
}
