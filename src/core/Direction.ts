import { Vector } from "./Vector";

export type DirectionCode = string;

export type DirectionType = typeof Direction.AllTypes[number];

export class Direction extends Vector {
  public static readonly AllTypes = ["F", "B", "L", "R"] as const;
  public static readonly CodeRegExp = /^(F|B|L|R)*$/;

  public readonly code: DirectionCode;

  constructor(dx: number, dy: number, code?: string) {
    super(dx, dy);
    this.code = code || Direction.stringify(this);
  }

  public override toString(): DirectionCode {
    return this.code;
  }

  public static parse(code: DirectionCode): Direction {
    const numberOf = { F: 0, B: 0, L: 0, R: 0 };

    code.split("").forEach((code) => numberOf[code as DirectionType]++);

    const dx = numberOf["R"] - numberOf["L"];
    const dy = numberOf["B"] - numberOf["F"];

    return new Direction(dx, dy, code);
  }

  public static isParsableCode(code: DirectionCode): boolean {
    return Direction.CodeRegExp.test(code);
  }

  public static stringify(direction: Vector): DirectionCode {
    const [dx, dy] = direction;
    const partFB = dy > 0 ? "B" : "F";
    const partLR = dx > 0 ? "R" : "L";
    return partFB.repeat(Math.abs(dy)) + partLR.repeat(Math.abs(dx));
  }

  public static isValid(direction: Vector): boolean {
    const [dx, dy] = direction;
    return !isNaN(dx) && isFinite(dx) && !isNaN(dy) && isFinite(dy);
  }

  public static ofCode(strings: TemplateStringsArray): Direction {
    return Direction.parse(strings.join(""));
  }
}
