import { Vector } from './Vector';

export type DirectionCode = string;

export type DirectionType = typeof Direction.AllTypes[number];

export class Direction extends Vector {
  public static readonly AllTypes = ['F', 'B', 'L', 'R'] as const;
  public static readonly CodeRegExp = /^(F|B|L|R)*$/;

  public readonly code: DirectionCode;

  constructor(dx: number, dy: number, code?: string) {
    super(dx, dy);
    this.code = code || Direction.stringify([dx, dy]);
  }

  public override toString(): DirectionCode {
    return this.code;
  }

  public static parse(code: DirectionCode): Direction {
    Direction.validateCanParse(code);

    const numberOf = { F: 0, B: 0, L: 0, R: 0 };

    code.split('').forEach((code) => numberOf[code as DirectionType]++);

    const dx = numberOf['R'] - numberOf['L'];
    const dy = numberOf['B'] - numberOf['F'];

    return new Direction(dx, dy, code);
  }

  private static validateCanParse(code: DirectionCode): void {
    if (!Direction.isParsableCode(code)) {
      throw new Error(`無法解析方位, 拿到了: ${code}`);
    }
  }

  public static isParsableCode(code: DirectionCode): boolean {
    return Direction.CodeRegExp.test(code);
  }

  public static stringify(direction: Vector): DirectionCode {
    Direction.validateCanStringify(direction);

    const [dx, dy] = direction;
    const partFB = dy > 0 ? 'B' : 'F';
    const partLR = dx > 0 ? 'R' : 'L';

    return partFB.repeat(Math.abs(dy)) + partLR.repeat(Math.abs(dx));
  }

  private static validateCanStringify(direction: Vector): void {
    if (!Direction.isValidDirection(direction)) {
      throw new Error(`無法將方位字串化, 拿到了: ${direction}`);
    }
  }

  public static isValidDirection(direction: Vector): boolean {
    const [dx, dy] = direction;
    return !isNaN(dx) && isFinite(dx) && !isNaN(dy) && isFinite(dy);
  }

  public static of(strings: TemplateStringsArray): Direction {
    return Direction.parse(strings.join(''));
  }
}
