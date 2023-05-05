import { Board } from "./board";
import { Direction, DirectionCode } from "./direction";
import { Move } from "./move";
import { PlacePiece } from "./moves/place-piece";
import { Player } from "./player";
import { Position } from "./position";
import { Turn } from "./turn";

const nearbyDirectionCodes: DirectionCode[] = ["F", "B", "L", "R", "FL", "FR", "BL", "BR"];
const nearbyDirections = nearbyDirectionCodes.map(Direction.parse);

export class Game {
  public readonly players: readonly Player[];
  public readonly board: Board;
  public turns: readonly Turn[];
  public winner: GameWinner;
  public ended: boolean;

  constructor(players: Player[], board: Board, turns: Turn[], winner: GameWinner, ended: boolean) {
    this.players = players;
    this.board = board;
    this.turns = turns;
    this.winner = winner;
    this.ended = ended;

    this.players.forEach((player) => (player.game = this));
    this.turns.forEach((turn) => (turn.game = this));

    Game.validate(this);
  }

  public async execute(): Promise<void> {
    while (!this.isEnded()) {
      await this.currentTurn!.execute();
      this.nextPlayerTurnOrEnd();
    }
  }

  public makeMove(move: Move): void {
    this.verifyMove(move);
    move.execute(this);
  }

  private verifyMove(move: Move): void {
    if (move.player !== this.currentTurn?.player) {
      throw new GameVerificationError("Move is not from turn player");
    }

    if (PlacePiece.isPlacePiece(move)) {
      this.verifyPlacePiece(move);
    }
  }

  private verifyPlacePiece(placePiece: PlacePiece): void {
    this.board.validatePosition(placePiece.position);

    if (!this.checkPlacePiece(placePiece)) {
      throw new GameVerificationError("PlacePiece position can't be placeable");
    }
  }

  private checkPlacePiece(placePiece: PlacePiece): boolean {
    const playerMark = placePiece.player.mark;
    const square = this.board.squareAt(placePiece.position);

    if (square.piece !== null) {
      return false;
    }

    if (!this.isAllPlayersHaveMoved()) {
      return true;
    }

    const nearbyPositions = nearbyDirections
      .filter((direction) => direction.x + placePiece.position.x >= 0 && direction.y + placePiece.position.y >= 0)
      .map((direction) => placePiece.position.to(direction))
      .filter((position) => this.board.isValidPosition(position));

    return nearbyPositions
      .map((position) => this.board.squareAt(position).piece)
      .some((piece) => piece?.mark === playerMark);
  }

  private isAllPlayersHaveMoved(): boolean {
    return this.turns.length > this.players.length;
  }

  public isEnded(): boolean {
    return this.ended;
  }

  private nextPlayerTurnOrEnd(): void {
    const turnPlayer = this.currentTurn!.player;
    const turnPlayerIndex = this.players.indexOf(turnPlayer);
    const nextPlayers = this.players.slice(turnPlayerIndex + 1).concat(this.players.slice(0, turnPlayerIndex));
    const nextPlayer = nextPlayers.find((player) => this.checkPlayerCanPlacePiece(player));

    if (!nextPlayer) {
      this.ended = true;

      if (this.checkPlayerCanPlacePiece(turnPlayer)) {
        this.winner = turnPlayer;
      }

      return;
    }

    const nextTurn = Turn.create(nextPlayer);
    nextTurn.game = this;

    this.turns = [...this.turns, nextTurn];
  }

  private checkPlayerCanPlacePiece(player: Player): boolean {
    return this.availablePositions
      .map((position) => PlacePiece.create(player, position))
      .some((placePiece) => this.checkPlacePiece(placePiece));
  }

  private get availablePositions(): Position[] {
    const positionsOfBoard = Array(this.board.width)
      .fill(null)
      .map((_, x) =>
        Array(this.board.height)
          .fill(null)
          .map((_, y) => Position.create(x, y))
      )
      .flat();

    return positionsOfBoard.filter((position) => this.board.squareAt(position).piece === null);
  }

  private get currentTurn(): Turn | null {
    return this.turns.at(-1) || null;
  }

  public static create(
    players: Player[],
    board: Board = Board.create(5),
    turns: Turn[] = [Turn.create(players[0]!)],
    winner: GameWinner = null,
    ended: boolean = false
  ): Game {
    return new Game(players, board, turns, winner, ended);
  }

  private static validate(game: Game): void {
    if (game.players.length !== 2) {
      throw new InvalidGameError("Game must have two players");
    }

    const allPlayersHaveUniqueMarks = game.players.every(
      (player, playerIndex) => playerIndex === game.players.findIndex((which) => which.mark === player.mark)
    );

    if (!allPlayersHaveUniqueMarks) {
      throw new InvalidGameError("Players must have unique marks");
    }
  }
}

export type GameWinner = Player | null;

export class InvalidGameError extends Error {}

InvalidGameError.prototype.name = "InvalidGameError";

export class GameVerificationError extends Error {}

GameVerificationError.prototype.name = "GameVerificationError";
