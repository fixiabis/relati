import { Direction } from '../../primitives/Direction';
import { PieceRole } from './PieceRole';

export class SniperRole extends PieceRole {
  public static readonly AttackDirections = ['F', 'B', 'L', 'R'].map(Direction.parse);

  constructor() {
    super('sniper');
  }
}
