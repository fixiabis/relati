import { BoardSquare } from '../board/BoardSquare';
import { Game } from '../Game';
import { Piece, PieceSymbol } from '../Piece';
import { DirectionPaths } from './DirectionPaths';
import { GameMode } from './GameMode';
import { RelationPath } from './RelationPath';

export class ModernMode extends GameMode {
  private readonly directionPaths: DirectionPaths;

  constructor(directionPaths: DirectionPaths = DirectionPaths.Modern) {
    super();
    this.directionPaths = directionPaths;
  }

  public calcBoardSize(numberOfPlayers: number): [width: number, height?: number] {
    return [numberOfPlayers * 4 + 1];
  }

  public placePieceOnSquare(game: Game, pieceSymbol: PieceSymbol, square: BoardSquare): void {
    const relationPaths = this.createRelationPaths(square);

    if (game.allPlayersHavePlaced && !this.anySimilarPieceRelated(relationPaths, pieceSymbol)) {
      throw new Error(`格子${square.position}無法聯繫到附近的符號`);
    }

    const piece = new Piece(pieceSymbol, square, { isRoot: !game.allPlayersHavePlaced, relationPaths });
    square.placePiece(piece);

    this.checkAllPiecesDisability(game);
  }

  private checkAllPiecesDisability(game: Game): void {
    game.board.pieces.forEach((piece) => (piece.disabled = !piece.isRoot));

    const enabledPieces = game.board.pieces.filter((piece) => !piece.disabled);

    for (const enabledPiece of enabledPieces) {
      const relatedPieces = enabledPiece.relatedPieces.filter((piece) => !enabledPieces.includes(piece));
      relatedPieces.forEach((piece) => (piece.disabled = false));
      enabledPieces.push(...relatedPieces);
    }
  }

  private createRelationPaths(square: BoardSquare): RelationPath[] {
    return this.directionPaths
      .filter((coordinates) => coordinates.every((coordinate) => square.squareDefinedTo(coordinate)))
      .map((coordinates) => coordinates.map((coordinate) => square.squareTo(coordinate)))
      .map(([targetSquare, ...otherSquares]) => new RelationPath(targetSquare!, otherSquares));
  }

  private anySimilarPieceRelated(relationPaths: RelationPath[], pieceSymbol: PieceSymbol): boolean {
    return relationPaths.some(
      (path) => !path.blocked && path.targetPiece?.symbol === pieceSymbol && !path.targetPiece.disabled
    );
  }

  public squareCanPlace(game: Game, square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    const paths = this.createRelationPaths(square);
    return !square.piece && (!game.allPlayersHavePlaced || this.anySimilarPieceRelated(paths, pieceSymbol));
  }
}
