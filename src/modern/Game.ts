import { ClassicGame } from '../classic/Game';
import { BoardSquare } from '../core/board/BoardSquare';
import { Player } from '../core/Player';
import { ModernPiece } from './Piece';

export class ModernGame extends ClassicGame {
  protected override canPlacePieceOnSquare(player: Player<ModernPiece>, square: BoardSquare<ModernPiece>): boolean {
    
  }
}
