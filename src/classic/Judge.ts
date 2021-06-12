import Board from './Board';
import Player from './Player';
import Link from './interfaces/Link';
import Placement from './interfaces/Placement';
import directions from './definitions/directions';

class Judge {
  public checkAnySameMarkOnBoard(board: Board, mark: Mark): boolean {
    const isMarkSame = this.checkMarkSame.bind(this, mark);
    const toMark = board.getMark.bind(board);
    return board.coordinates.map(toMark).some(isMarkSame);
  }

  public checkGridEmpty(board: Board, [x, y]: Coordinate): boolean {
    return board.marks[x][y] === null;
  }

  public checkLinkConditionReached(link: Link): boolean {
    const { board, coordinate, mark } = link;
    const isCoordinateValid = board.checkCoordinateValid.bind(board);
    const isMarkSame = this.checkMarkSame.bind(this, mark);
    const toMark = board.getMark.bind(board);
    const toMovedCoordinate = this.getMovedCoordinate.bind(this, coordinate);
    return directions.map(toMovedCoordinate).filter(isCoordinateValid).map(toMark).some(isMarkSame);
  }

  public checkMarkSame(markA: Mark | null, markB: Mark | null): boolean {
    return markA === markB;
  }

  public checkPlacementConditionReached(placement: Placement): boolean {
    const { board, coordinate, mark } = placement;
    const isGridEmpty = this.checkGridEmpty(board, coordinate);
    const isAnySameMarkOnBoard = this.checkAnySameMarkOnBoard.bind(this, board, mark);
    const isReachedLinkCondition = this.checkLinkConditionReached.bind(this, placement);
    return isGridEmpty && (isReachedLinkCondition() || !isAnySameMarkOnBoard());
  }

  public checkPlayerCanTakeAction(board: Board, player: Player): boolean {
    const toPlacement = player.takePlacement.bind(player, board);
    const isPlacementConditionReached = this.checkPlacementConditionReached.bind(this);
    return board.coordinates.map(toPlacement).some(isPlacementConditionReached);
  }

  public getMovedCoordinate([x, y]: Coordinate, [dx, dy]: Coordinate): Coordinate {
    return [x + dx, y + dy];
  }
}

export default Judge;
