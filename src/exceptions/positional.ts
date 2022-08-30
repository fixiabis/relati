export class PositionException extends Error {
  constructor(message: string) {
    super(`positional/Position: ${message}`);
  }
}

export class DirectionException extends Error {
  constructor(message: string) {
    super(`positional/Direction: ${message}`);
  }
}
