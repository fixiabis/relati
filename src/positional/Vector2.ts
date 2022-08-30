export type Vector2 = [x: number, y: number];

export interface VectorConstructor {
  new (...args: number[]): number[];
}

export interface Vector2Constructor {
  new (...args: Vector2): Vector2;
}

export const Vector2 = Array as VectorConstructor as Vector2Constructor;
