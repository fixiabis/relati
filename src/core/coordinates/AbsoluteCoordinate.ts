import { Coordinate } from './Coordinate';

export type Position = string;

export class AbsoluteCoordinate extends Coordinate {
  public static readonly PositionRegExp = /^(?<alphabetPart>[A-Z])(?<numberPart>\d+)$/;

  public override toString(): string {
    return AbsoluteCoordinate.stringify(this);
  }

  public static parse(position: Position): AbsoluteCoordinate {
    if (!AbsoluteCoordinate.canParse(position)) {
      throw new Error(`Can't parse position, got: ${position}`);
    }

    const x = position.charCodeAt(0) - 'A'.charCodeAt(0);
    const y = parseInt(position.slice(1)) - 1;
    return new AbsoluteCoordinate(x, y);
  }

  public static stringify(coordinate: Coordinate): Position {
    const [x, y] = coordinate;
    const alphabetPart = String.fromCharCode(x + 'A'.charCodeAt(0));
    const numberPart = (y + 1).toString();
    return alphabetPart + numberPart;
  }

  public static canParse(position: Position): boolean {
    return AbsoluteCoordinate.PositionRegExp.test(position);
  }
}
