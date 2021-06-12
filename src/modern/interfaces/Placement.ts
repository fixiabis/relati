import ClassicPlacement from '../../classic/interfaces/Placement';
import Board from '../Board';

interface Placement extends ClassicPlacement {
  readonly board: Board;
}

export default Placement;
