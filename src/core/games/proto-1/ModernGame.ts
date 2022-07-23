import { Board } from '../../board';
import { Piece, PieceSymbol } from '../../piece';
import { Player } from '../../players/proto-1/Player';
import { RelationMode } from '../../relation';
import { Game, GameInit } from './Game';

export interface ModernGameInit extends GameInit {
  board?: Board;
  relationMode?: RelationMode;
}

export class ModernGame extends Game {
  public readonly relationMode: RelationMode;
  private rootPieces: Partial<Record<PieceSymbol, Piece>>;

  constructor(players: Player<Game>[], init: ModernGameInit) {
    const boardSize = players.length * 4 + 1;

    super(players, init.board || new Board(boardSize), init);

    this.relationMode = init.relationMode || RelationMode.Modern;
    this.rootPieces = this.findRootPieces(this.board);
  }

  private findRootPieces(board: Board): Partial<Record<PieceSymbol, Piece>> {
    const rootPieces = {} as Partial<Record<PieceSymbol, Piece>>;

    for (const square of board.squareList) {
      if (square.piece?.isRoot) {
        rootPieces[square.piece.symbol] = square.piece;
      }
    }

    return rootPieces;
  }

  protected pieceCanPlace(piece: Piece): boolean {
    return piece.isRoot !== this.allRootPlaced && piece.relatedPieces.some((relatedPiece) => !relatedPiece.disabled);
  }

  protected override onPlacedPiece(piece: Piece): void {
    super.onPlacedPiece(piece);

    if (piece.isRoot) {
      this.rootPieces[piece.symbol] = piece;
    }

    if (this.allRootPlaced) {
      this.checkAllPiecesDisability();
    }
  }

  public get allRootPlaced(): boolean {
    return Object.keys(this.rootPieces).length === this.players.length;
  }

  protected checkAllPiecesDisability(): void {
    const enabledPieces = Object.values(this.rootPieces);

    this.board.pieces.forEach((piece) => (piece.disabled = !piece.isRoot));

    for (const enabledPiece of enabledPieces) {
      const relatedPieces = enabledPiece.relatedPieces.filter((piece) => !enabledPieces.includes(piece));
      relatedPieces.forEach((piece) => (piece.disabled = false));
      enabledPieces.push(...relatedPieces);
    }
  }
}
