import { Coordinate } from './types';

/**
 * Rosenberg-Strong pairing function coordinate graph
 *
 *  y
 * 16 17 18 19 20
 *  9 10 11 12 21
 *  4  5  6 13 22
 *  1  2  7 14 23
 *  0  3  8 15 24 x
 */

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

/**
 * custom paring function coordinate graph (inspired by Rosenberg-Strong pairing function)
 *
 *        x
 * 24 09 10 11 12
 * 23 08 01 02 13
 * 22 07 00 03 14 y
 * 21 06 05 04 15
 * 20 19 18 17 16
 */

/**
 * @todo optimization
 * custom pairing function used
 */
export function convertDirectionToIndex(direction: Coordinate): number {
  const [x, y] = direction;
  const shell = Math.max(Math.abs(x) * 2 - +(x > 0), Math.abs(y) * 2 - +(y > 0));
  const shellBase = Math.ceil(shell / 2) * ((shell % 2) - ((shell + 1) % 2));
  const shellBaseSign = Math.sign(shellBase);
  const start = shell * shell;
  return start + shell + x * shellBaseSign - y * shellBaseSign;
}

/**
 * @todo optimization
 * custom pairing function used
 */
export function convertIndexToDirection(index: number): Coordinate {
  const shell = Math.floor(Math.sqrt(index));
  const shellBase = Math.ceil(shell / 2) * ((shell % 2) - ((shell + 1) % 2));
  const shellBaseSign = Math.sign(shellBase);
  const start = shell * shell;
  const n = index - start - shell;
  return [shellBase + shellBaseSign * Math.min(n, 0), shellBase - shellBaseSign * Math.max(n, 0)];
}
