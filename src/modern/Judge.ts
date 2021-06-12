import ClassicJudge from '../classic/Judge';
import Board from './Board';
import paths from './definitions/paths';
import Link from './interfaces/Link';

class Judge extends ClassicJudge {
  public checkAnySameMarkOnBoard(board: Board, mark: Mark): boolean {
    return Boolean(board.rootCoordinates[mark]) || super.checkAnySameMarkOnBoard(board, mark);
  }

  public checkGridHasSameMark(board: Board, mark: Mark, [x, y]: Coordinate): boolean {
    return this.checkMarkSame(board.marks[x][y], mark);
  }

  public checkLinkConditionReached(link: Link): boolean {
    const { board, coordinate, mark } = link;
    const isPathValid = this.checkPathValid.bind(this, board);
    const isPathAvailable = this.checkPathAvailable.bind(this, board, mark);
    const toMovedPath = this.getMovedPath.bind(this, coordinate);
    return paths.map(toMovedPath).filter(isPathValid).some(isPathAvailable);
  }

  public checkPathAvailable(board: Board, mark: Mark, path: Coordinate[]): boolean {
    const [coordinate, ...otherCoordinates] = path;
    const [x, y] = coordinate;

    return (
      !board.extraMarks[x][y].isMissingNode &&
      this.checkGridHasSameMark(board, mark, coordinate) &&
      otherCoordinates.every(this.checkGridEmpty.bind(this, board))
    );
  }

  public checkPathValid(board: Board, path: Coordinate[]): boolean {
    return path.every(board.checkCoordinateValid.bind(board));
  }

  public getLinkConditionReachedPaths(link: Link): Coordinate[][] {
    const { board, coordinate, mark } = link;
    const isPathValid = this.checkPathValid.bind(this, board);
    const isPathAvailable = this.checkPathAvailable.bind(this, board, mark);
    const toMovedPath = this.getMovedPath.bind(this, coordinate);
    return paths.map(toMovedPath).filter(isPathValid).filter(isPathAvailable);
  }

  public getMovedPath(coordinate: Coordinate, path: Coordinate[]): Coordinate[] {
    return path.map((direction) => this.getMovedCoordinate(coordinate, direction));
  }

  public updateBoardExtraMarks(board: Board): void {
    const sourceCoordinates = [];

    for (const mark in board.rootCoordinates) {
      const sourceCoordinate = board.rootCoordinates[mark];
      sourceCoordinates.push(sourceCoordinate);
    }

    const markedCoordinates = board.coordinates.filter(([x, y]) => board.marks[x][y] !== null);

    for (const [x, y] of markedCoordinates) {
      board.extraMarks[x][y].isMissingNode = false;
      board.extraMarks[x][y].isMissingNodeMaybe = true;
    }

    for (const sourceCoordinate of sourceCoordinates) {
      const [sourceX, sourceY] = sourceCoordinate;
      const mark = board.marks[sourceX][sourceY] as string;
      const link = { board, coordinate: sourceCoordinate, mark };
      const paths = this.getLinkConditionReachedPaths(link);
      const newSourcePaths = paths.filter(([[x, y]]) => board.extraMarks[x][y].isMissingNodeMaybe);

      board.extraMarks[sourceX][sourceY].isMissingNodeMaybe = false;

      for (const [coordinate] of newSourcePaths) {
        sourceCoordinates.push(coordinate);
      }
    }

    for (const [x, y] of markedCoordinates) {
      board.extraMarks[x][y].isMissingNode = board.extraMarks[x][y].isMissingNodeMaybe;
      delete board.extraMarks[x][y].isMissingNodeMaybe;
    }
  }
}

export default Judge;
