import { MARKS } from '../shared/constants/marks';
import Board from '../shared/Board/Board';
import SquareOfBoard from '../shared/Board/SquareOfBoard';
import Judge from './Judge';
import Player from './Player';

class Game {
  public currentPlayer!: Player;
  public winner: Player | null = null;
  public isOver: boolean = false;

  static create(numberOfPlayers: number): Game {
    const marks = MARKS.slice(0, numberOfPlayers);
    const judge = new Judge();
    const players = marks.map((mark) => new Player(mark));
    const size = numberOfPlayers * 2 + 1;
    const board = new Board(size, size);

    for (const mark of marks) {
      board.marks[mark] = {};
    }

    return new Game(players, board, judge);
  }

  constructor(
    public readonly players: Player[],
    public readonly board: Board,
    public readonly judge: Judge
  ) {
    this.currentPlayer = this.players[0];
  }

  public handleSquareSelect(square: SquareOfBoard): void {
    const isSquareCanBePlace = this.judge.judgeSquareCanBePlace(square, this.currentPlayer.mark);

    if (isSquareCanBePlace) {
      this.currentPlayer.placeMark(square);
      this.changeCurrentPlayerOrEnd(square.board);
    }
  }

  public changeCurrentPlayerOrEnd(board: Board): void {
    const nextPlayer = this.findNextPlayerWhoCanPlace(board);
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

    this.currentPlayer = nextPlayer!;
  }

  public findNextPlayerWhoCanPlace(board: Board): Player | null {
    const playersStartByNextPlayer = this.getPlayersStartByNextPlayer();
    const isPlayerCanPlace = (player: Player) => this.judge.judgePlayerCanPlace(player, board);
    return playersStartByNextPlayer.find(isPlayerCanPlace) || null;
  }

  public getPlayersStartByNextPlayer(): Player[] {
    const indexOfCurrentPlayer = this.players.indexOf(this.currentPlayer);
    const indexOfNextPlayer = (indexOfCurrentPlayer + 1) % this.players.length;
    return this.players.slice(indexOfNextPlayer).concat(this.players.slice(0, indexOfNextPlayer));
  }
}

export default Game;
