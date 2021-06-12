import Placement from './interfaces/Placement';
import Board from './Board';
import Player from './Player';
import Judge from './Judge';

class Game {
  public currentPlayer: Player | null;
  public isOver: boolean = false;
  public winner: Player | null = null;

  constructor(public board: Board, public players: Player[], public judge: Judge) {
    this.currentPlayer = players[0];
    this.currentPlayer.actionsRemaining = 1;
  }

  protected getPlayersAfterCurrentPlayer(): Player[] {
    const playerIndex = this.players.indexOf(this.currentPlayer!);
    const nextPlayerIndex = playerIndex + 1;
    return this.players.slice(nextPlayerIndex).concat(this.players.slice(0, nextPlayerIndex));
  }

  public handlePlacement(placement: Placement): void {
    const isPlacementAllowed =
      placement.mark === this.currentPlayer?.mark &&
      this.judge.checkPlacementConditionReached(placement);

    if (isPlacementAllowed) {
      this.board.setMark(placement.coordinate, placement.mark);
      this.handleAfterPlacement(placement);
      this.endOrChangeToNextPlayer();
    }
  }

  protected handleAfterPlacement(placement: Placement): void {
    const { coordinate, mark } = placement;
    const isRootMark = !(mark in this.board.rootCoordinates);

    if (isRootMark) {
      const [x, y] = coordinate;
      this.board.extraMarks[x][y].isRoot = true;
      this.board.rootCoordinates[mark] = coordinate;
      this.currentPlayer!.actionsRemaining--;
      return;
    }

    this.updateBoardAndPlayerState();
  }

  protected updateBoardAndPlayerState() {
    const prevBoard = this.board.clone();

    this.judge.updateBoardExtraMarks(this.board);
    this.judge.updatePlayerActionsRemaining(this.board, prevBoard, this.currentPlayer!);
  }

  protected endOrChangeToNextPlayer(): void {
    const players = this.getPlayersAfterCurrentPlayer();
    const isPlayerCanTakeAction = this.judge.checkPlayerCanTakeAction.bind(this.judge, this.board);
    const nextPlayer = players.find(isPlayerCanTakeAction) || null;

    if (nextPlayer === null || nextPlayer === this.currentPlayer) {
      return this.end(nextPlayer);
    }

    if (this.currentPlayer!.actionsRemaining) {
      return;
    }

    this.currentPlayer = nextPlayer;
    this.currentPlayer!.actionsRemaining = 1;
  }

  public end(winner: Player | null): void {
    this.currentPlayer = null;
    this.winner = winner;
    this.isOver = true;
  }
}

export default Game;
