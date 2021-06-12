import Board from '../Board';

interface Link {
  readonly board: Board;
  readonly coordinate: Coordinate;
  readonly mark: Mark;
}

export default Link;
