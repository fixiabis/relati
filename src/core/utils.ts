import { Coordinate } from './types';

/**
 * Rosenberg-Strong pairing function used
 */
export function convertCoordinateToIndex(coordinate: Coordinate): number {
  const [x, y] = coordinate;
  const shell = Math.max(x, y);
  const start = shell * shell;
  return start + shell + x - y;
}

/**
 * Rosenberg-Strong pairing function used
 */
export function convertIndexToCoordinate(index: number): Coordinate {
  const shell = Math.floor(Math.sqrt(index));
  const start = shell * shell;
  const n = index - start - shell;
  return [shell + Math.min(n, 0), shell - Math.max(n, 0)];
}
