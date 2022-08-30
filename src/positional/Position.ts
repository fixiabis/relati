import { PositionException } from "../exceptions/positional";
import { Vector } from "./Vector";

export type PositionCode = string & { isPositionCode: true };

export class Position extends Vector {
  public static readonly CodeRegExp = /^(?<alphabetPart>[A-Z])(?<numberPart>\d+)$/;

  public to(direction: Vector): Position {
    if (!this.validTo(direction)) {
      throw new PositionException(`To invalid position by "${direction}" at "${this}"`);
    }

    return this.toDirectly(direction);
  }

  public validTo(direction: Vector): boolean {
    const [x, y] = this;
    const [dx, dy] = direction;
    return Position.isValid([x + dx, y + dy]);
  }

  public toDirectly(direction: Vector): Position {
    const [x, y] = this;
    const [dx, dy] = direction;
    return new Position(x + dx, y + dy);
  }

  public override toString(): PositionCode {
    return Position.stringifyDirectly(this);
  }

  public static parse(code: string): Position {
    if (!Position.isParsableCode(code)) {
      throw new PositionException("Code unparsable");
    }

    return this.parseDirectly(code);
  }

  public static isParsableCode(code: string): code is PositionCode {
    return Position.CodeRegExp.test(code);
  }

  public static parseDirectly(code: PositionCode): Position {
    const x = code.charCodeAt(0) - "A".charCodeAt(0);
    const y = parseInt(code.slice(1)) - 1;
    return new Position(x, y);
  }

  public static stringify(position: Vector): PositionCode {
    if (!Position.isValid(position)) {
      throw new PositionException("Invalid position");
    }

    return this.stringifyDirectly(position);
  }

  public static isValid(position: Vector): boolean {
    const [x, y] = position;
    return !isNaN(x) && x > -1 && x < 26 && !isNaN(y) && y > -1 && y < 26;
  }

  public static stringifyDirectly(position: Vector): PositionCode {
    const [x, y] = position;
    const alphabetPart = String.fromCharCode(x + "A".charCodeAt(0));
    const numberPart = (y + 1).toString();
    return (alphabetPart + numberPart) as PositionCode;
  }

  public static of(position: Vector): Position {
    if (!Position.isValid(position)) {
      throw new PositionException("Invalid position");
    }

    return Position.ofDirectly(position);
  }

  public static ofDirectly(position: Vector): Position {
    return new Position(...position);
  }
}
