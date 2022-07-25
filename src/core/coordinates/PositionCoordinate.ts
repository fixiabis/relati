import { Coordinate } from './Coordinate';

export type Position = string;

export class PositionCoordinate extends Coordinate {
  public static readonly PositionRegExp = /^(?<alphabetPart>[A-Z])(?<numberPart>\d+)$/;

  public override toString(): string {
    return PositionCoordinate.stringify(this);
  }

  public static parse(position: Position): PositionCoordinate {
    if (!PositionCoordinate.isPosition(position)) {
      throw new Error(`Can't parse position, got: ${position}`);
    }

    const x = position.charCodeAt(0) - 'A'.charCodeAt(0);
    const y = parseInt(position.slice(1)) - 1;
    return new PositionCoordinate(x, y);
  }

  public static stringify(coordinate: Coordinate): Position {
    const [x, y] = coordinate;

    if (x < 0 || y < 0) {
      throw new Error(`Can't stringify coordinate, got: ${coordinate}`);
    }

    const alphabetPart = String.fromCharCode(x + 'A'.charCodeAt(0));
    const numberPart = (y + 1).toString();
    return alphabetPart + numberPart;
  }

  public static isPosition(position: Position): boolean {
    return PositionCoordinate.PositionRegExp.test(position);
  }
}