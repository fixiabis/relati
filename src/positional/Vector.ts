export type Vector = [x: number, y: number];

export const Vector = Array as { new (...args: number[]): number[] } as {
  new (...args: Vector): Vector;
};
