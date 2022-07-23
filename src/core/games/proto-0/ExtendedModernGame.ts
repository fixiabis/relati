import { Piece, PieceSymbol } from '../../piece';
import { BoardSquare } from '../../board';
import { Player } from '../../players';
import { ModernGame, ModernGameInit } from './ModernGame';

export interface ExtendedModernGameInit extends ModernGameInit {
  activePlayerMovesRemaining?: number;
}

export class HyperModernGame extends ModernGame {
  private _activePlayerMovesRemaining!: number;

  public get activePlayerMovesRemaining(): number {
    return this._activePlayerMovesRemaining;
  }

  private set activePlayerMovesRemaining(value: number) {
    this._activePlayerMovesRemaining = value;
  }

  constructor(players: Player[], init: ExtendedModernGameInit) {
    super(players, init);
    this.activePlayerMovesRemaining = init.activePlayerMovesRemaining || 1;
  }

  protected override canPlacePiece(player: Player, square: BoardSquare): boolean {
    return super.canPlacePiece(player, square) && Boolean(this.activePlayerMovesRemaining);
  }

  private createDisabledPiecesStats(): Record<PieceSymbol, number> {
    const disabledPiecesStats = {} as Record<PieceSymbol, number>;
    this.players.forEach((player) => (disabledPiecesStats[player.pieceSymbol] = 0));
    this.allPieces.forEach((piece) => (disabledPiecesStats[piece.symbol] += Number(piece.disabled)));
    return disabledPiecesStats;
  }

  protected override onPiecePlaced(piece: Piece): void {
    const disabledPiecesStatsBefore = this.createDisabledPiecesStats();

    super.onPiecePlaced(piece);

    const disabledPiecesStatsAfter = this.createDisabledPiecesStats();

    this.activePlayerMovesRemaining--;

    const activePlayerDisabledPiecesDecreased =
      disabledPiecesStatsAfter[this.activePlayer.pieceSymbol] <
      disabledPiecesStatsBefore[this.activePlayer.pieceSymbol];

    if (activePlayerDisabledPiecesDecreased) {
      this.activePlayerMovesRemaining++;
    }

    const otherPlayersDisabledPiecesIncreased = this.players
      .filter((player) => player !== this.activePlayer)
      .reduce(
        (increased, player) =>
          increased +
          Number(disabledPiecesStatsAfter[player.pieceSymbol] > disabledPiecesStatsBefore[player.pieceSymbol]),
        0
      );

    this.activePlayerMovesRemaining += otherPlayersDisabledPiecesIncreased;
  }

  public abandonRemainingMoves(player: Player): void {
    this.onTurnStart(player);
    this.activePlayerMovesRemaining = 0;
    this.onTurnEnd(player);
  }

  protected override onTurnEnd(player: Player): void {
    if (this.activePlayerMovesRemaining) {
      return;
    }

    super.onTurnEnd(player);
    this.activePlayerMovesRemaining = 1;
  }
}
