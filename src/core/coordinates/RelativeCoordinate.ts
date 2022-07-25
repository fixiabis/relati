import { Coordinate } from './Coordinate';

export type Direction = string;

export class RelativeCoordinate extends Coordinate {
  public static readonly DirectionRegExp = /^(F|B|L|R)*$/;

  public override toString(): string {
    return RelativeCoordinate.stringify(this);
  }

  public static parse(direction: Direction): RelativeCoordinate {
    if (!RelativeCoordinate.canParse(direction)) {
      throw new Error(`Can't parse direction, got: ${direction}`);
    }

    const numberOf = { F: 0, B: 0, L: 0, R: 0 };
    const types = direction.split('') as (keyof typeof numberOf)[];
    types.forEach((type) => numberOf[type]++);
    return [numberOf['R'] - numberOf['L'], numberOf['B'] - numberOf['F']];
  }

  public static stringify(coordinate: RelativeCoordinate): Direction {
    const [dx, dy] = coordinate;
    const partFB = dy > 0 ? 'B' : 'F';
    const partLR = dx > 0 ? 'R' : 'L';
    return partFB.repeat(Math.abs(dy)) + partLR.repeat(Math.abs(dx));
  }

  public static canParse(direction: Direction): boolean {
    return RelativeCoordinate.DirectionRegExp.test(direction);
  }
}
