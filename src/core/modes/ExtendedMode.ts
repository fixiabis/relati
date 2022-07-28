import { BoardSquare } from '../board/BoardSquare';
import { Game } from '../Game';
import { PieceSymbol } from '../Piece';
import { GameMode } from './GameMode';

export class ExtendedMode extends GameMode {
  private readonly mode: GameMode;

  constructor(mode: GameMode) {
    super();
    this.mode = mode;
  }

  public calcBoardSize(numberOfPlayers: number): [width: number, height?: number] {
    return this.mode.calcBoardSize(numberOfPlayers);
  }

  public placePieceOnSquare(game: Game, pieceSymbol: PieceSymbol, square: BoardSquare): void {
    const disabledPiecesStatsBefore = this.countDisabledPieces(game);

    this.mode.placePieceOnSquare(game, pieceSymbol, square);

    const disabledPiecesStatsAfter = this.countDisabledPieces(game);

    const disabledPiecesAnalysis = this.analyzeStats(game, disabledPiecesStatsBefore, disabledPiecesStatsAfter);

    const activePlayerDisabledPiecesDecreased = Number(disabledPiecesAnalysis[game.activePlayer.pieceSymbol]! < 0);

    const otherPlayersDisabledPiecesIncreased = game.players
      .filter((player) => player !== game.activePlayer)
      .map((player) => disabledPiecesAnalysis[player.pieceSymbol]! > 0)
      .reduce((increased, piecesIncreased) => increased + Number(piecesIncreased), 0);

    game.activePlayer.movesRemaining += activePlayerDisabledPiecesDecreased + otherPlayersDisabledPiecesIncreased;
  }

  public override abandonRemainingMoves(game: Game): void {
    game.activePlayer.movesRemaining = 1;
  }

  public squareCanPlace(game: Game, square: BoardSquare, pieceSymbol: PieceSymbol): boolean {
    return this.mode.squareCanPlace(game, square, pieceSymbol);
  }

  private countDisabledPieces(game: Game): Partial<Record<PieceSymbol, number>> {
    const disabledPiecesStats = {} as Partial<Record<PieceSymbol, number>>;
    game.players.forEach((player) => (disabledPiecesStats[player.pieceSymbol] = 0));
    game.board.pieces.forEach((piece) => (disabledPiecesStats[piece.symbol]! += Number(piece.disabled)));
    return disabledPiecesStats;
  }

  private analyzeStats(
    game: Game,
    statsBefore: Partial<Record<PieceSymbol, number>>,
    statsAfter: Partial<Record<PieceSymbol, number>>
  ): Partial<Record<PieceSymbol, number>> {
    const disabledPiecesAnalysis = {} as Partial<Record<PieceSymbol, number>>;
    game.players.forEach((player) => statsAfter[player.pieceSymbol]! - statsBefore[player.pieceSymbol]!);
    return disabledPiecesAnalysis;
  }
}
