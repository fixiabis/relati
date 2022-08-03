export type Vector = readonly [x: number, y: number];

export interface VectorConstructor {
  new (x: number, y: number): Vector;
}

export const Vector = Array as new (...items: unknown[]) => readonly unknown[] as VectorConstructor;
