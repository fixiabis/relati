import { BoardSquare } from '../board/BoardSquare';
import { RelationPath } from './RelationPath';
import { RelativePaths } from './RelativePaths';

export class RelationMode {
  public static readonly Classic = new RelationMode(RelativePaths.ForClassic);

  public static readonly Modern = new RelationMode(RelativePaths.ForModern);

  public readonly relativePaths: RelativePaths;

  private constructor(relativePaths: RelativePaths) {
    this.relativePaths = relativePaths;
  }

  public createPaths(square: BoardSquare): RelationPath[] {
    return this.relativePaths
      .filter((coordinates) => coordinates.every((coordinate) => square.squareDefinedTo(coordinate)))
      .map((coordinates) => coordinates.map((coordinate) => square.squareTo(coordinate)))
      .map(([targetSquare, ...otherSquares]) => new RelationPath(targetSquare!, otherSquares));
  }
}
