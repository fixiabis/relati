import { Board } from "./board/Board";
import { BoardSquare } from "./board/BoardSquare";
import { GameException } from "./exceptions/game";
import { DirectionPaths } from "./DirectionPaths";
import { Piece, PieceSymbol } from "./piece/Piece";
import { PieceRelation } from "./piece/PieceRelation";
import { RootPiece } from "./piece/RootPiece";
import { Player } from "./Player";
import { Position } from "./positional/Position";

export interface GameInit {
  activePlayer?: Player;
  winner?: Player | null;
  ended?: boolean;
}

export class Game {
  public readonly players: readonly Player[];
  public readonly board: Board<Piece>;
  public readonly roots: Partial<Record<PieceSymbol, RootPiece>>;
  private readonly directionPaths: DirectionPaths;
  public activePlayer: Player;
  public winner: Player | null;
  public ended: boolean;
  private _allPlayersHaveRoot: boolean;

  constructor(players: Player[], board: Board<Piece>, directionPaths: DirectionPaths, init: GameInit = {}) {
    this.players = players;
    this.board = board;
    this.directionPaths = directionPaths;
    this.roots = this.findRoots(board);
    this.activePlayer = init.activePlayer || players[0]!;
    this.winner = init.winner || null;
    this.ended = init.ended || false;
    this._allPlayersHaveRoot = this.allPlayersHaveRoot;
  }

  private findRoots(board: Board<Piece>): Partial<Record<PieceSymbol, RootPiece>> {
    const roots: Partial<Record<PieceSymbol, RootPiece>> = {};
    const rootList = board.pieces.filter((piece) => piece.isRoot) as RootPiece[];

    for (const root of rootList) {
      roots[root.symbol] = root;
    }

    return roots;
  }

  public placePieceOnTurn(pieceSymbol: PieceSymbol, positionCode: string): void {
    const position = Position.parse(positionCode);
    const square = this.board.squareAt(position);
    this.shouldPieceSymbolOfActivePlayer(pieceSymbol);
    this.placePiece(pieceSymbol, square);
    this.eliminatePlayers();
    this.turnNextPlayerOrEnd();
  }

  private shouldPieceSymbolOfActivePlayer(pieceSymbol: PieceSymbol): void {
    if (pieceSymbol !== this.activePlayer.pieceSymbol) {
      throw new GameException(`Piece symbol "${pieceSymbol}" not of active player`);
    }
  }

  private placePiece(pieceSymbol: PieceSymbol, square: BoardSquare<Piece>): void {
    if (!this.canPlacePiece(pieceSymbol, square)) {
      throw new GameException(`Piece symbol "${pieceSymbol}" can't place at "${square.position}"`);
    }

    if (square.piece) {
      throw new GameException(`Square at "${square.position}" has been taken`);
    }

    this._placePiece(pieceSymbol, square);
  }

  private canPlacePiece(pieceSymbol: PieceSymbol, square: BoardSquare<Piece>): boolean {
    const similarPieces = this.board.pieces.filter((piece) => piece.symbol === pieceSymbol && !piece.disabled);

    return (
      !this.roots[pieceSymbol] ||
      similarPieces.some((piece) =>
        piece.relations.some((relation) => !relation.blocked && relation.endingSquare === square)
      )
    );
  }

  private _placePiece(pieceSymbol: PieceSymbol, square: BoardSquare<Piece>): void {
    const piece = this.createPiece(pieceSymbol, square);
    square.placePiece(piece);

    if (piece.isRoot) {
      this.roots[piece.symbol] = piece as RootPiece;
    }

    if (this.allPlayersHaveRoot) {
      this.handleRelations();
    }
  }

  private createPiece(pieceSymbol: PieceSymbol, square: BoardSquare<Piece>): Piece {
    const PieceType = this.allPlayersHaveRoot ? Piece : RootPiece;
    const relations = this.createRelations(square);
    return new PieceType(pieceSymbol, square, { relations });
  }

  private createRelations(square: BoardSquare<Piece>): PieceRelation[] {
    const relations = this.directionPaths
      .filter(([endingDirection]) => square.squareDefinedTo(endingDirection!))
      .map((directions) => directions.map((direction) => square._squareTo(direction)))
      .map(([endingSquare, ...passingSquares]) => new PieceRelation(endingSquare!, passingSquares, square));

    return relations;
  }

  private handleRelations(): void {
    const senders = this.players.map((player) => this.roots[player.pieceSymbol]) as Piece[];

    for (const piece of this.board.pieces) {
      piece.receivedRelation = null;
    }

    for (const sender of senders) {
      sender.sendRelations();

      const receivers = sender.relations
        .filter((relation) => relation.receiver?.receivedRelation?.sender === sender)
        .map((relation) => relation.receiver!);

      senders.push(...receivers);
    }
  }

  private eliminatePlayers(): void {
    for (const player of this.players) {
      player.eliminated ||= !this.playerCanPlacePiece(player);
    }
  }

  private playerCanPlacePiece(player: Player): boolean {
    const pieces = this.board.pieces.filter((piece) => piece.symbol === player.pieceSymbol && !piece.disabled);

    return (
      !this.roots[player.pieceSymbol] ||
      pieces.some((piece) => piece.relations.some((relation) => !relation.blocked && !relation.receiver))
    );
  }

  private turnNextPlayerOrEnd(): void {
    const [nextPlayer] = this.possibleNextPlayers;

    if (nextPlayer) {
      this.activePlayer = nextPlayer;
      return;
    }

    if (!this.activePlayer.eliminated) {
      this.winner = this.activePlayer;
    }

    this.ended = true;
  }

  private get possibleNextPlayers(): Player[] {
    const activePlayerIndex = this.players.indexOf(this.activePlayer);

    const possibleNextPlayers = this.players
      .slice(activePlayerIndex + 1)
      .concat(this.players.slice(0, activePlayerIndex))
      .filter((player) => !player.eliminated);

    return possibleNextPlayers;
  }

  public handlePlayerAbstain(pieceSymbol: PieceSymbol): void {
    this.shouldPieceSymbolExistsInGame(pieceSymbol);

    const player = this.players.find((who) => who.pieceSymbol === pieceSymbol)!;

    player.abstained = true;
    player.eliminated = true;

    if (this.activePlayer.pieceSymbol === pieceSymbol) {
      this.turnNextPlayerOrEnd();
    }
  }

  private shouldPieceSymbolExistsInGame(pieceSymbol: PieceSymbol): void {
    const playerSymbols = this.players.map((player) => player.pieceSymbol);

    if (!playerSymbols.includes(pieceSymbol)) {
      throw new GameException(`Piece symbol "${pieceSymbol}" not exists in game`);
    }
  }

  public get allPlayersHaveRoot(): boolean {
    return (this._allPlayersHaveRoot ||= this.players.every((player) => this.roots[player.pieceSymbol]));
  }
}
