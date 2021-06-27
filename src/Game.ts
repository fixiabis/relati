import { MARKS } from './constants';
import Board from './Board/Board';
import SquareOfBoard from './Board/SquareOfBoard';
import Judge from './Judge';
import Player from './Player';

class Game {
  public readonly board: Board;
  public readonly players: Player[];
  public currentPlayer: Player;
  public winner: Player | null = null;
  public isOver: boolean = false;

  constructor(public readonly numberOfPlayers: number, public readonly judge: Judge) {
    const boardSize = this.judge.calcBoardSize(numberOfPlayers);
    this.board = new Board(boardSize, boardSize);
    this.players = MARKS.slice(0, numberOfPlayers).map((mark) => new Player(mark));
    this.currentPlayer = this.players[0];
  }

  public handleSquareChoose(square: SquareOfBoard): void {
    const isSquareCanBePlace = this.judge.judgeSquareCanBePlace(square, this.currentPlayer.mark);

    if (isSquareCanBePlace) {
      this.currentPlayer.placeMark(square!);
      this.handleAfterCurrentPlayerPlaceMark();
    }
  }

  public handleAfterCurrentPlayerPlaceMark(): void {
    const nextPlayer = this.findNextPlayerWhoCanPlace();

    if (nextPlayer === this.currentPlayer || nextPlayer === null) {
      this.winner = nextPlayer;
      this.isOver = true;
      return;
    }

    this.currentPlayer = nextPlayer;
  }

  public findNextPlayerWhoCanPlace(): Player | null {
    const indexOfCurrentPlayer = this.players.indexOf(this.currentPlayer);
    const indexOfNextPlayer = (indexOfCurrentPlayer + 1) % this.players.length;

    const playersStartByNextPlayer = this.players
      .slice(indexOfNextPlayer)
      .concat(this.players.slice(0, indexOfNextPlayer));

    const isPlayerCanPlace = (player: Player) => this.judge.judgePlayerCanPlace(player, this.board);

    return playersStartByNextPlayer.find(isPlayerCanPlace) || null;
  }
}

export default Game;
