export type Coordinate = readonly [x: number, y: number];

export interface CoordinateConstructor {
  new (x: number, y: number): Coordinate;
}

export const Coordinate = Array as new (...items: unknown[]) => readonly unknown[] as CoordinateConstructor;
