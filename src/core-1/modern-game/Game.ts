import { Board } from "../Board";
import { BoardSquare } from "../BoardSquare";
import { DirectionPaths } from "../DirectionPaths";
import { Game, GameInit } from "../Game";
import { PieceSymbol } from "../Piece";
import { Player } from "../Player";
import { RelationPath } from "../RelationPath";
import { ModernPiece } from "./Piece";

export interface ModernGameInit<TPiece extends ModernPiece, TPlayer extends Player> extends GameInit<TPiece, TPlayer> {
  directionPaths?: DirectionPaths;
}

export class ModernGame<TPiece extends ModernPiece, TPlayer extends Player> extends Game<TPiece, TPlayer> {
  public readonly directionPaths: DirectionPaths;

  constructor(players: TPlayer[], init: ModernGameInit<TPiece, TPlayer> = {}) {
    super(players, init);
    this.directionPaths = init.directionPaths || DirectionPaths.Modern;
  }

  protected override createBoard(players: Player[]): Board<TPiece> {
    return new Board<TPiece>(players.length * 4 + 1);
  }

  public override placePieceOnSquare(square: BoardSquare<TPiece>, pieceSymbol: PieceSymbol): void {
    const relationPaths = this.createRelationPaths(square);

    if (this.allPlayersHavePiece && !this.anySimilarPieceRelated(relationPaths, pieceSymbol)) {
      throw new Error(`格子${square.position}無法聯繫到附近的符號`);
    }

    const piece = new ModernPiece(pieceSymbol, square, { isRoot: !this.allPlayersHavePiece, relationPaths }) as TPiece;
    square.placePiece(piece);

    this.checkAllPiecesDisability();
  }

  private checkAllPiecesDisability(): void {
    this.board.pieces.forEach((piece) => (piece.disabled = !piece.isRoot));

    const enabledPieces = this.board.pieces.filter((piece) => !piece.disabled);

    for (const enabledPiece of enabledPieces) {
      const relatedPieces = enabledPiece.relatedPieces.filter((piece) => piece.disabled) as TPiece[];
      relatedPieces.forEach((piece) => (piece.disabled = false));
      enabledPieces.push(...relatedPieces);
    }
  }

  private createRelationPaths(square: BoardSquare<TPiece>): RelationPath<TPiece>[] {
    return this.directionPaths
      .filter((coordinates) => coordinates.every((coordinate) => square.squareDefinedTo(coordinate)))
      .map((coordinates) => coordinates.map((coordinate) => square.squareTo(coordinate)))
      .map(([targetSquare, ...otherSquares]) => new RelationPath(targetSquare!, otherSquares));
  }

  private anySimilarPieceRelated(relationPaths: RelationPath<TPiece>[], pieceSymbol: PieceSymbol): boolean {
    return relationPaths.some(
      (path) => !path.blocked && path.targetPiece?.symbol === pieceSymbol && !path.targetPiece.disabled
    );
  }

  protected override squareCanPlace(square: BoardSquare<TPiece>, pieceSymbol: PieceSymbol): boolean {
    const paths = this.createRelationPaths(square);

    return (
      super.squareCanPlace(square, pieceSymbol) &&
      (!this.allPlayersHavePiece || this.anySimilarPieceRelated(paths, pieceSymbol))
    );
  }
}
