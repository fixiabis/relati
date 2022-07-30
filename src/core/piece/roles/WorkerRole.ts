import { Piece } from '../Piece';
import { PieceRole, PieceRoleType } from './PieceRole';

export class WorkerRole extends PieceRole {
  private roles: Record<PieceRoleType, PieceRole>;

  constructor(roles: Record<PieceRoleType, PieceRole>) {
    super('worker');
    this.roles = roles;
  }

  public canBecome(piece: Piece, roleType: PieceRoleType): boolean {
    return this.canMove(piece) && roleType in this.roles && !['leader', 'worker'].includes(roleType);
  }

  public become(piece: Piece, roleType: PieceRoleType): void {
    piece.role = this.roles[roleType]!;
  }
}
