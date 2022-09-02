import { DirectionException } from "../exceptions/positional";
import { Vector2 } from "./Vector2";

export type DirectionCode = string & { isDirectionCode: true };

export type DirectionType = typeof Direction.AllTypes[number];

export class Direction extends Vector2 {
  public static readonly AllTypes = ["F", "B", "L", "R"] as const;
  public static readonly CodeRegExp = /^(F|B|L|R)*$/;

  public override toString(): DirectionCode {
    return Direction._stringify(this);
  }

  public static parse(code: string): Direction {
    if (!Direction.isParsableCode(code)) {
      throw new DirectionException("Code unparsable");
    }

    return Direction._parse(code);
  }

  public static isParsableCode(code: string): code is DirectionCode {
    return Direction.CodeRegExp.test(code);
  }

  public static _parse(code: DirectionCode): Direction {
    const numberOf = { F: 0, B: 0, L: 0, R: 0 };

    code.split("").forEach((code) => numberOf[code as DirectionType]++);

    const dx = numberOf["R"] - numberOf["L"];
    const dy = numberOf["B"] - numberOf["F"];

    return new Direction(dx, dy);
  }

  public stringify(direction: Vector2): DirectionCode {
    if (!Direction.isValid(direction)) {
      throw new DirectionException("Invalid direction");
    }

    return Direction._stringify(direction);
  }

  public static isValid(direction: Vector2): boolean {
    const [dx, dy] = direction;
    return !isNaN(dx) && isFinite(dx) && !isNaN(dy) && isFinite(dy);
  }

  public static _stringify(direction: Vector2): DirectionCode {
    const [dx, dy] = direction;
    const partFB = dy > 0 ? "B" : "F";
    const partLR = dx > 0 ? "R" : "L";
    return (partFB.repeat(Math.abs(dy)) + partLR.repeat(Math.abs(dx))) as DirectionCode;
  }
}
