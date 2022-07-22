export type Coordinate = readonly [x: number, y: number];

export interface CoordinateConstructor {
  new (x: number, y: number): Coordinate;
}

export const Coordinate = Array as new (...items: any[]) => readonly any[] as CoordinateConstructor;
