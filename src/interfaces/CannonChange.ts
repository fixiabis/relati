import Board from '../Board';

interface CannonChange {
  readonly board: Board;
  readonly coordinate: Coordinate;
  readonly mark: Mark;
}

export default CannonChange;
