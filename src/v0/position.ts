import { Direction } from "./direction";

export class Position {
  public static CODE_REGEXP = /^(?<alphabet>[A-Z])(?<number>\d+)$/;

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    Position.validate(this);
  }

  public to(direction: Direction): Position {
    return new Position(this.x + direction.x, this.y + direction.y);
  }

  public toString(): PositionCode {
    const positionCodeAlphabet = String.fromCharCode(this.x + 65) as PositionCodeAlphabet;
    const positionCodeNumber = (this.y + 1) as PositionCodeNumber;
    return `${positionCodeAlphabet}${positionCodeNumber}`;
  }

  public static parse(positionCode: PositionCode) {
    this.validatePositionCode(positionCode);

    const parts = Position.CODE_REGEXP.exec(positionCode)!.groups!;

    const x = parts["alphabet"]!.charCodeAt(0) - 65;
    const y = parseInt(parts["number"]!) - 1;

    return new Position(x, y);
  }

  public static create(x: number, y: number): Position {
    return new Position(x, y);
  }

  private static validatePositionCode(positionCode: PositionCode): void {
    if (!Position.CODE_REGEXP.test(positionCode)) {
      throw new InvalidPositionCodeError("Position code is invalid");
    }
  }

  private static validate(position: Position): void {
    if (!isFinite(position.x) || !isFinite(position.y)) {
      throw new InvalidPositionError("Position must be finite");
    }

    if (position.x < 0 || position.y < 0) {
      throw new InvalidPositionError("Position must be positive");
    }
  }
}

export class InvalidPositionError extends Error {}

InvalidPositionError.prototype.name = "InvalidPositionError";

export type PositionCode = `${PositionCodeAlphabet}${PositionCodeNumber}`;

export type PositionCodeAlphabet =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O";

export type PositionCodeNumber = RangeNumber<1, 16>;

export class InvalidPositionCodeError extends Error {}

InvalidPositionCodeError.prototype.name = "InvalidPositionCodeError";
