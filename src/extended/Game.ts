import ClassicGame from '../classic/Game';
import ModernGame from '../modern/Game';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';
import { MARKS } from '../shared/constants/marks';
import GameOptions from './GameOptions';
import Judge from './Judge';
import Player from './Player';

class Game extends ModernGame {
  public currentPlayer!: Player;

  static create(numberOfPlayers: number, options?: GameOptions): ClassicGame | ModernGame | Game {
    if (!options) {
      return ModernGame.create(numberOfPlayers);
    }

    if (options?.linkMode === 'classic') {
      return ClassicGame.create(numberOfPlayers);
    }

    const marks = MARKS.slice(0, numberOfPlayers);
    const judge = new Judge();
    const players = marks.map((mark) => new Player(mark));
    const size = numberOfPlayers * 4 + 1;
    const board = new Board(size, size);

    for (const mark of marks) {
      board.stateOfMarks[mark] = {};
    }

    return new Game(players, board, judge, options || {});
  }

  constructor(
    public readonly players: Player[],
    public readonly board: Board,
    public readonly judge: Judge,
    public readonly options: GameOptions
  ) {
    super(players, board, judge);
    this.currentPlayer.actionsRemaining = 1;
  }

  public handleSquareSelect(square: SquareOfBoard): void {
    const isSquareCanBePlace = this.judge.judgeSquareCanBePlace(square, this.currentPlayer.mark);

    if (!this.currentPlayer.selectedSquare && isSquareCanBePlace) {
      this.handleSquarePlaceMark(square);
      return this.handleCurrentPlayerCompletedAction(square.board);
    }
  }

  public handleCurrentPlayerCompletedAction(board: Board) {
    this.currentPlayer.actionsRemaining--;

    if (this.options.isComboActionActive) {
      const unlinkedNumberChanges = this.calcUnlinkedNumberChangesByUpdateStateOfMarks(board);

      const extraActionRemaining =
        this.calcExtraActionRemainingOfCurrentPlayer(unlinkedNumberChanges);

      this.currentPlayer.actionsRemaining += extraActionRemaining;
      return this.changeCurrentPlayerOrEnd(board);
    }

    this.updateStateOfMarks(board);
    this.changeCurrentPlayerOrEnd(board);
  }

  public calcUnlinkedNumberChangesByUpdateStateOfMarks(board: Board): Record<Mark, number> {
    const prevUnlinkedNumbers = this.judge.countUnlinkedNumberOfEachMark(board);

    this.updateStateOfMarks(board);

    const unlinkedNumbers = this.judge.countUnlinkedNumberOfEachMark(board);

    const unlinkedNumberChanges = {} as Record<Mark, number>;

    for (const mark in unlinkedNumbers) {
      const prevUnlinkedNumber = prevUnlinkedNumbers[mark as Mark];
      const unlinkedNumber = unlinkedNumbers[mark as Mark];
      unlinkedNumberChanges[mark as Mark] = unlinkedNumber - prevUnlinkedNumber;
    }

    return unlinkedNumberChanges;
  }

  public calcExtraActionRemainingOfCurrentPlayer(
    unlinkedNumberChanges: Record<Mark, number>
  ): number {
    const otherPlayers = this.players.filter((player) => player !== this.currentPlayer);

    const otherPlayersWhoUnlinkedNumberIncreased = otherPlayers.filter(
      (player) => unlinkedNumberChanges[player.mark] > 0
    );

    const isCurrentPlayerUnlinkedNumberDecreased =
      unlinkedNumberChanges[this.currentPlayer.mark] < 0;

    return (
      Number(isCurrentPlayerUnlinkedNumberDecreased) + otherPlayersWhoUnlinkedNumberIncreased.length
    );
  }

  public changeCurrentPlayerOrEnd(board: Board): void {
    const nextPlayer = this.findNextPlayerWhoCanPlace(board) as Player | null;
    const isAnyPlayerCanPlace = nextPlayer !== null;
    const isOnlyCurrentPlayerCanPlace = nextPlayer === this.currentPlayer;

    if (isOnlyCurrentPlayerCanPlace) {
      this.winner = this.currentPlayer;
      this.isOver = true;
      return;
    }

    if (!isAnyPlayerCanPlace) {
      this.isOver = true;
      return;
    }

    if (!this.currentPlayer.actionsRemaining) {
      this.currentPlayer = nextPlayer!;
      this.currentPlayer.actionsRemaining = 1;
    }
  }
}

export default Game;
