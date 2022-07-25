import { BoardSquare } from '../../core/board/BoardSquare';
import { ModernPiece } from '../Piece';
import { RelationPath } from './RelationPath';
import { DirectionPaths } from './DirectionPaths';

export class RelationMode {
  public static readonly Classic = new RelationMode(DirectionPaths.ForClassic);

  public static readonly Modern = new RelationMode(DirectionPaths.ForModern);

  public readonly relativePaths: DirectionPaths;

  private constructor(relativePaths: DirectionPaths) {
    this.relativePaths = relativePaths;
  }

  public createPaths(square: BoardSquare<ModernPiece>): RelationPath[] {
    return this.relativePaths
      .filter((coordinates) => coordinates.every((coordinate) => square.squareDefinedTo(coordinate)))
      .map((coordinates) => coordinates.map((coordinate) => square.squareTo(coordinate)))
      .map(([targetSquare, ...otherSquares]) => new RelationPath(targetSquare!, otherSquares));
  }
}
