export class BoardException extends Error {
  constructor(message: string) {
    super(`board/Board: ${message}`);
  }
}

export class BoardSquareException extends Error {
  constructor(message: string) {
    super(`board/BoardSquare: ${message}`);
  }
}
