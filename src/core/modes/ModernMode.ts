import { Board } from '../board/Board';
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

  public createBoard(numberOfPlayers: number): Board {
    return new Board(numberOfPlayers * 4 + 1);
  }

  public placePieceOnSquare(game: Game, pieceSymbol: PieceSymbol, square: BoardSquare): void {
    const paths = this.createPaths(square);

    if (game.allPlayersHavePlaced && !this.anySimilarPieceRelated(paths, pieceSymbol)) {
      throw new Error('無法聯繫到附近的符號');
    }

    const piece = new Piece(pieceSymbol, square);
    square.placePiece(piece);
    this.checkAllPiecesDisability(game);
  }

  private checkAllPiecesDisability(game: Game): void {
    const enabledPieces = Object.values(game.rootPieces);

    game.board.pieces.forEach((piece) => (piece.disabled = !piece.isRoot));

    for (const enabledPiece of enabledPieces) {
      const relatedPieces = enabledPiece.relatedPieces.filter((piece) => !enabledPieces.includes(piece));
      relatedPieces.forEach((piece) => (piece.disabled = false));
      enabledPieces.push(...relatedPieces);
    }
  }

  private createPaths(square: BoardSquare): RelationPath[] {
    return this.directionPaths
      .filter((coordinates) => coordinates.every((coordinate) => square.squareDefinedTo(coordinate)))
      .map((coordinates) => coordinates.map((coordinate) => square.squareTo(coordinate)))
      .map(([targetSquare, ...otherSquares]) => new RelationPath(targetSquare!, otherSquares));
  }

  private anySimilarPieceRelated(paths: RelationPath[], pieceSymbol: PieceSymbol): boolean {
    return paths.some((path) => path.targetPiece?.symbol === pieceSymbol && !path.targetPiece.disabled);
  }

  public squareCanPlace(game: Game, square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    const paths = this.createPaths(square);
    return !square.piece && (!game.allPlayersHavePlaced || this.anySimilarPieceRelated(paths, pieceSymbol));
  }
}
