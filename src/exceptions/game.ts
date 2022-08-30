export class GameException extends Error {
  constructor(message: string) {
    super("game/Game: " + message);
  }
}
