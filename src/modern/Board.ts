import ClassicBoard from '../classic/Board';

class Board extends ClassicBoard {
  public extraMarks: Record<string, boolean>[][];
  public rootCoordinates: Record<Mark, Coordinate> = {};

  constructor(width: number, height: number) {
    super(width, height);
    this.extraMarks = this.marks.map((marks) => marks.map(() => ({})));
  }
}

export default Board;
