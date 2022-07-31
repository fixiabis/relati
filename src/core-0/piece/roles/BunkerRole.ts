import { PieceRole } from './PieceRole';

export class BunkerRole extends PieceRole {
  constructor() {
    super('bunker');
  }

  public override canBeTarget(): boolean {
    return false;
  }
}
