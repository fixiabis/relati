import Board from './Board';
import { CLASSIC_PATHS, MODERN_PATHS } from './constants/paths';
import JudgeOptions from './interfaces/JudgeOptions';
import Link from './interfaces/Link';
import Placement from './interfaces/Placement';
import Player from './Player';

class Judge {
  protected paths: Coordinate[][];

  constructor(protected options: JudgeOptions) {
    this.paths = options.linkMode === 'classic' ? CLASSIC_PATHS : MODERN_PATHS;
  }

  public checkGridEmpty(board: Board, [x, y]: Coordinate): boolean {
    return board.marks[x][y] === null;
  }

  public checkGridHasSameMark(board: Board, mark: Mark, [x, y]: Coordinate): boolean {
    return board.marks[x][y] === mark;
  }

  public checkPlacementConditionReached(placement: Placement): boolean {
    const { board, coordinate, mark } = placement;
    const isGridEmpty = this.checkGridEmpty(board, coordinate);
    const isAnySameMarkOnBoard = mark in board.rootCoordinates;
    const isReachedLinkCondition = this.checkLinkConditionReached.bind(this, placement);
    return isGridEmpty && (isReachedLinkCondition() || !isAnySameMarkOnBoard);
  }

  public checkPlayerCanTakeAction(board: Board, player: Player): boolean {
    const toPlacement = player.takePlacement.bind(player, board);
    const isPlacementConditionReached = this.checkPlacementConditionReached.bind(this);
    return board.coordinates.map(toPlacement).some(isPlacementConditionReached);
  }

  public getMovedCoordinate([x, y]: Coordinate, [dx, dy]: Coordinate): Coordinate {
    return [x + dx, y + dy];
  }

  public checkLinkConditionReached(link: Link): boolean {
    const { board, coordinate, mark } = link;
    const isPathValid = this.checkPathValid.bind(this, board);
    const isPathAvailable = this.checkPathAvailable.bind(this, board, mark);
    const toMovedPath = this.getMovedPath.bind(this, coordinate);
    return this.paths.map(toMovedPath).filter(isPathValid).some(isPathAvailable);
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

  public getMovedPath(coordinate: Coordinate, path: Coordinate[]): Coordinate[] {
    return path.map((direction) => this.getMovedCoordinate(coordinate, direction));
  }

  public getLinkConditionReachedPaths(link: Link): Coordinate[][] {
    const { board, coordinate, mark } = link;
    const isPathValid = this.checkPathValid.bind(this, board);
    const isPathAvailable = this.checkPathAvailable.bind(this, board, mark);
    const toMovedPath = this.getMovedPath.bind(this, coordinate);
    return this.paths.map(toMovedPath).filter(isPathValid).filter(isPathAvailable);
  }

  public updateBoardExtraMarks(board: Board): void {
    if (this.options.linkMode === 'classic') {
      return;
    }

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
