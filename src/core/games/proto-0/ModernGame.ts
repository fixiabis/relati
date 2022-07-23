import { Board, BoardSquare } from '../../board';
import { Piece, PieceSymbol } from '../../piece';
import { Player } from '../../players';
import { RelationMode } from '../../relation';
import { Game, GameInit } from './Game';

export interface ModernGameInit extends GameInit {
  board?: Board;
  relationMode: RelationMode;
}

export class ModernGame extends Game {
  private rootPieces: Partial<Record<PieceSymbol, Piece>>;

  public get allRootPiecesOnBoard(): boolean {
    return Object.keys(this.rootPieces).length === this.players.length;
  }

  public readonly relationMode: RelationMode;

  constructor(players: Player[], init: ModernGameInit) {
    const boardSize = players.length * 4 + 1;

    super(players, init.board || new Board(boardSize), init);
    this.relationMode = init.relationMode;
    this.rootPieces = {};

    this.board.squareList.forEach((square) => {
      if (square.piece?.isRoot) {
        this.rootPieces[square.piece.symbol] = square.piece;
      }
    });
  }

  protected canPlacePiece(player: Player, square: BoardSquare): boolean {
    return this.relationMode
      .createPaths(square)
      .map((relationPath) => relationPath.targetPiece)
      .some((piece) => piece && piece.symbol === player.pieceSymbol && !piece.disabled);
  }

  protected override createPiece(player: Player, square: BoardSquare): Piece {
    const isRoot = !this.allRootPiecesOnBoard;
    const relationPaths = this.relationMode.createPaths(square);
    return new Piece(player.pieceSymbol, square, { isRoot, relationPaths });
  }

  protected override onPiecePlaced(piece: Piece): void {
    if (piece.isRoot) {
      this.rootPieces[piece.symbol] = piece;
    }

    if (this.allRootPiecesOnBoard) {
      this.checkAllPiecesDisability();
    }
  }

  protected checkAllPiecesDisability(): void {
    const enabledPieces = Object.values(this.rootPieces);

    this.allPieces.forEach((piece) => (piece.disabled = !piece.isRoot));

    for (const enablePiece of enabledPieces) {
      const relatedPieces = enablePiece.relatedPieces.filter((piece) => !enabledPieces.includes(piece));
      relatedPieces.forEach((piece) => (piece.disabled = false));
      enabledPieces.push(...relatedPieces);
    }
  }
}
