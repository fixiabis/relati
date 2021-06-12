import ClassicLink from '../../classic/interfaces/Link';
import Board from '../Board';

interface Link extends ClassicLink {
  readonly board: Board;
}

export default Link;
