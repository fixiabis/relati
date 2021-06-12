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

  public getMarkedCoordinates(board: Board): Coordinate[] {
    return board.coordinates.filter(([x, y]) => board.marks[x][y] !== null);
  }

  public updateBoardExtraMarks(board: Board): void {
    if (this.options.linkMode === 'classic') {
      return;
    }

    const sourceCoordinates = this.getInitialSourceCoordinates(board);
    const markedCoordinates = this.getMarkedCoordinates(board);

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

  public getInitialSourceCoordinates(board: Board): Coordinate[] {
    const sourceCoordinates = [];

    for (const mark in board.rootCoordinates) {
      const sourceCoordinate = board.rootCoordinates[mark];
      sourceCoordinates.push(sourceCoordinate);
    }

    return sourceCoordinates;
  }

  public updatePlayerActionsRemaining(
    prevBoard: Board,
    board: Board,
    players: Player[],
    player: Player
  ): void {
    if (!this.options.canUseComboAction) {
      return;
    }

    const marks = players.map(({ mark }) => mark);
    const missingNodesChanged = this.getMissingNodesChanged(board, prevBoard, marks);
    const extraActionsRemaining = this.calcExtraActionsRemaining(missingNodesChanged, player.mark);

    player.actionsRemaining += extraActionsRemaining;
  }

  public calcExtraActionsRemaining(missingNodesChanged: Record<Mark, number>, playerMark: Mark) {
    let extraActionsRemaining = 0;

    for (const mark in missingNodesChanged) {
      if (mark !== playerMark && missingNodesChanged[mark] > 0) {
        extraActionsRemaining++;
      }
    }

    if (missingNodesChanged[playerMark] < 0) {
      extraActionsRemaining++;
    }

    return extraActionsRemaining;
  }

  public getMissingNodesChanged(
    prevBoard: Board,
    board: Board,
    marks: Mark[]
  ): Record<Mark, number> {
    const missingNodesChanged: Record<Mark, number> = {};

    for (const mark of marks) {
      missingNodesChanged[mark] = 0;
    }

    const prevMarkedCoordinates = this.getMarkedCoordinates(prevBoard);

    for (const [x, y] of prevMarkedCoordinates) {
      const mark = prevBoard.marks[x][y]!;
      const isMissingNode = prevBoard.extraMarks[x][y].isMissingNode;
      missingNodesChanged[mark] += -isMissingNode;
    }

    const markedCoordinates = this.getMarkedCoordinates(board);

    for (const [x, y] of markedCoordinates) {
      const mark = board.marks[x][y]!;
      const isMissingNode = board.extraMarks[x][y].isMissingNode;
      missingNodesChanged[mark] += +isMissingNode;
    }

    return missingNodesChanged;
  }
}

export default Judge;
