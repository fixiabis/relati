export class Direction {
  public static readonly CODE_REGEXP = /^[CFBLR]*$/;

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    Direction.validate(this);
  }

  public toString(): DirectionCode {
    const directionCode =
      "F".repeat(Math.max(-this.y, 0)) +
      "B".repeat(Math.max(this.y, 0)) +
      "L".repeat(Math.max(-this.x, 0)) +
      "R".repeat(Math.max(this.x, 0));

    return (directionCode || "C") as DirectionCode;
  }

  public static parse(directionCode: DirectionCode): Direction {
    Direction.validateDirectionCode(directionCode);

    const partCounts: Record<DirectionCodePart, number> = { C: 0, F: 0, B: 0, L: 0, R: 0 };
    Array.from(directionCode).forEach((part) => (partCounts[part as DirectionCodePart] += 1));

    const x = partCounts["R"] - partCounts["L"];
    const y = partCounts["B"] - partCounts["F"];

    return new Direction(x, y);
  }

  private static validateDirectionCode(directionCode: DirectionCode): void {
    if (!Direction.CODE_REGEXP.test(directionCode)) {
      throw new InvalidDirectionCodeError("Invalid direction code");
    }
  }

  private static validate(direction: Direction): void {
    if (!isFinite(direction.x) || !isFinite(direction.y)) {
      throw new InvalidDirectionError("Direction must be finite");
    }
  }
}

export class InvalidDirectionError extends Error {}

InvalidDirectionError.prototype.name = "InvalidDirectionError";

export type DirectionCodePart = "C" | "F" | "B" | "L" | "R";

export type DirectionCode = "C" | UnionOfRepeatedString<Exclude<DirectionCodePart, "C">, 3>;

export class InvalidDirectionCodeError extends Error {}

InvalidDirectionCodeError.prototype.name = "InvalidDirectionCodeError";
