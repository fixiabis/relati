import Board from '../Board';

interface Placement {
  readonly board: Board;
  readonly coordinate: Coordinate;
  readonly mark: Mark;
}

export default Placement;
