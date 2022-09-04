import { PositionException } from "../exceptions/positional";
import { Vector2 } from "./Vector2";

export type PositionCode = string & { isPositionCode: true };

export class Position extends Vector2 {
  public static readonly CodeRegExp = /^(?<alphabetPart>[A-Z])(?<numberPart>\d+)$/;

  public to(direction: Vector2): Position {
    if (!this.validTo(direction)) {
      throw new PositionException(`To invalid position by "${direction}" at "${this}"`);
    }

    return this._to(direction);
  }

  public validTo(direction: Vector2): boolean {
    const [x, y] = this;
    const [dx, dy] = direction;
    return Position.canStringify([x + dx, y + dy]);
  }

  public _to(direction: Vector2): Position {
    const [x, y] = this;
    const [dx, dy] = direction;
    return new Position(x + dx, y + dy);
  }

  public override toString(): PositionCode {
    return Position._stringify(this);
  }

  public static parse(code: string): Position {
    if (!Position.canParse(code)) {
      throw new PositionException("Code unparsable");
    }

    return this._parse(code);
  }

  public static canParse(code: string): code is PositionCode {
    return Position.CodeRegExp.test(code);
  }

  public static _parse(code: PositionCode): Position {
    const x = code.charCodeAt(0) - "A".charCodeAt(0);
    const y = parseInt(code.slice(1)) - 1;
    return new Position(x, y);
  }

  public static stringify(position: Vector2): PositionCode {
    if (!Position.canStringify(position)) {
      throw new PositionException("Invalid position");
    }

    return this._stringify(position);
  }

  public static canStringify(position: Vector2): boolean {
    const [x, y] = position;
    return !isNaN(x) && x > -1 && x < 26 && !isNaN(y) && y > -1 && y < 26;
  }

  public static _stringify(position: Vector2): PositionCode {
    const [x, y] = position;
    const alphabetPart = String.fromCharCode(x + "A".charCodeAt(0));
    const numberPart = (y + 1).toString();
    return (alphabetPart + numberPart) as PositionCode;
  }

  public static of(position: Vector2): Position {
    return new Position(...position);
  }
}
