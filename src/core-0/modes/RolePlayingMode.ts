import { BoardSquare } from '../board/BoardSquare';
import { Piece, PieceInit, PieceSymbol } from '../piece/Piece';
import { PieceRole, PieceRoleType } from '../piece/roles/PieceRole';
import { DirectionPaths } from './DirectionPaths';
import { ModernMode } from './ModernMode';

export class RolePlayingMode extends ModernMode {
  private roles: Record<PieceRoleType, PieceRole>;

  constructor(roles: Record<PieceRoleType, PieceRole>, directionPaths: DirectionPaths) {
    super(directionPaths);
    this.roles = roles;
  }

  public override calcBoardSize(numberOfPlayers: number): [width: number, height?: number] {
    return [numberOfPlayers * 5 + 1];
  }

  protected override createPiece(pieceSymbol: PieceSymbol, square: BoardSquare, pieceInit: PieceInit): Piece {
    pieceInit.role = this.roles[pieceInit.isRoot ? 'leader' : 'worker']!;
    return new Piece(pieceSymbol, square, pieceInit);
  }
}
