import Board from '../Board';

interface CannonChange {
  readonly board: Board;
  readonly coordinate: Coordinate;
  readonly mark: Mark;
  readonly direction: Coordinate;
}

export default CannonChange;
