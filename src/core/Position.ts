import { Vector } from "./Vector";

export type PositionCode = string;

export class Position extends Vector {
  public static readonly CodeRegExp = /^(?<alphabetPart>[A-Z])(?<numberPart>\d+)$/;

  public readonly code: PositionCode;

  constructor(x: number, y: number, code?: string) {
    super(x, y);
    this.code = code || Position.stringify(this);
  }

  public to(direction: Vector): Position {
    const [x, y] = this;
    const [dx, dy] = direction;
    return new Position(x + dx, y + dy);
  }

  public validTo(direction: Vector): boolean {
    const [x, y] = this;
    const [dx, dy] = direction;
    return Position.isValid([x + dx, y + dy]);
  }

  public override toString(): PositionCode {
    return this.code;
  }

  public static parse(code: PositionCode): Position {
    const x = code.charCodeAt(0) - "A".charCodeAt(0);
    const y = parseInt(code.slice(1)) - 1;
    return new Position(x, y, code);
  }

  public static isParsableCode(code: PositionCode): boolean {
    return Position.CodeRegExp.test(code);
  }

  public static stringify(position: Vector): PositionCode {
    const [x, y] = position;
    const alphabetPart = String.fromCharCode(x + "A".charCodeAt(0));
    const numberPart = (y + 1).toString();
    return alphabetPart + numberPart;
  }

  public static isValid(position: Vector): boolean {
    const [x, y] = position;
    return !isNaN(x) && x > -1 && x < 26 && !isNaN(y) && y > -1 && y < 26;
  }

  public static ofCode(strings: TemplateStringsArray): Position {
    return Position.parse(strings.join(""));
  }

  public static of(position: Vector): Position {
    return new Position(...position);
  }
}
