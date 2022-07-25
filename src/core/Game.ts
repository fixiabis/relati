import { Board } from './board/Board';
import { BoardSquare } from './board/BoardSquare';
import { Position, PositionCoordinate } from './coordinates/PositionCoordinate';
import { Piece } from './Piece';
import { Player } from './Player';

export interface GameInit<TPiece extends Piece> {
  board: Board<TPiece>;
  ended?: boolean;
  winner?: Player<TPiece> | null;
  activePlayer?: Player<TPiece>;
  allPlayersHavePlaced?: boolean;
}

export class Game<TPiece extends Piece> {
  private _players!: readonly Player<TPiece>[];
  public readonly board: Board<TPiece>;
  public ended: boolean;
  public winner: Player<TPiece> | null;
  public activePlayer: Player<TPiece>;
  public allPlayersHavePlaced: boolean;

  constructor(players: Player<TPiece>[], init: GameInit<TPiece>) {
    this.players = players;
    this.board = init.board;
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this.allPlayersHavePlaced = init.allPlayersHavePlaced || false;
  }

  public placePiece(player: Player<TPiece>, position: Position): void {
    this.beforePlacePiece(player, position);
    
    const positionCoordinate = PositionCoordinate.parse(position);
    const square = this.board.squareAt(positionCoordinate);
    this.placePieceOnSquare(player, square);
    
    this.afterPlacePiece(square.piece!);
  }

  protected beforePlacePiece(player: Player<TPiece>, _position: Position): void {
    if (player !== this.activePlayer) {
      throw new Error('player not active');
    }
  }

  protected placePieceOnSquare(player: Player<TPiece>, square: BoardSquare<TPiece>): void {
    const piece = player.createPiece(square, this);
    square.placePiece(piece);
  }

  protected afterPlacePiece(_piece: TPiece): void {
    this.changeNextPlayerOrEnd();
  }

  private changeNextPlayerOrEnd(): void {
    const nextPlayer = this.findNextPlayer();

    if (nextPlayer && nextPlayer !== this.activePlayer) {
      this.activePlayer = nextPlayer;
      return;
    }

    this.winner = nextPlayer;
    this.ended = true;
  }

  protected findNextPlayer(): Player<TPiece> | null {
    const activePlayerIndex = this.players.indexOf(this.activePlayer);
    return this.players[(activePlayerIndex + 1) % this.players.length]!;
  }

  public get players(): readonly Player<TPiece>[] {
    return this._players;
  }

  private set players(value: readonly Player<TPiece>[]) {
    const playersCorrectOrdered = value.every((player, index) => player.pieceSymbol === Piece.AllSymbols[index]);

    if (!playersCorrectOrdered) {
      throw new Error(`Game can't accept players, got: ${value}`);
    }

    this._players = value;
  }
}
