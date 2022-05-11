import Game from '../Game';
import Move from '../moves/Move';
import Placement, { isPlacement } from '../moves/Placement';
import GameManager from './GameManager';

abstract class BaseGameManager implements GameManager {
  public abstract createGame(numberOfPlayers: number): Game;

  protected judgePlacement(game: Readonly<Game>, move: Placement): void {
    if (!game.board.hasCoordinate(move.coordinate)) {
      throw new Error('放置座標不存在');
    }

    const [x, y] = move.coordinate;
    const coordinateHasTaken = game.board.pieces[x]![y] !== null;

    if (coordinateHasTaken) {
      throw new Error('放置座標已被使用');
    }

    this.judgePlacementValid(game, move);
  }

  protected judgePlacementValid(game: Readonly<Game>, move: Placement): void {
    const allPlayersHasFirstMove = game.moves.length >= game.numberOfPlayers;

    if (!allPlayersHasFirstMove) {
      return;
    }

    const placementValid = this.checkPlacementValidAfterFirstMove(game, move);

    if (!placementValid) {
      throw new Error('放置不符規則');
    }
  }

  protected abstract checkPlacementValidAfterFirstMove(game: Readonly<Game>, move: Placement): boolean;

  protected judgeMove(game: Readonly<Game>, move: Move): void {
    if (move.player !== game.currentPlayer) {
      throw new Error('行動方不為目前玩家');
    }

    if (isPlacement(move)) {
      return this.judgePlacement(game, move);
    }
  }

  public addMoveInGame(game: Readonly<Game>, move: Move): void {
    this.judgeMove(game, move);
    game.addMove(move);
    this.prepareNextTurn(game);
  }

  protected prepareNextTurn(game: Readonly<Game>): void {
    this.eliminatePlayers(game);
    this.changeNextPlayerOrEndGame(game);
  }

  protected eliminatePlayers(game: Readonly<Game>): void {
    for (let player = 0; player < game.numberOfPlayers; player++) {
      const playerHasEliminated = game.eliminatedPlayers.includes(player);
      const playerEliminated = () => this.checkPlayerEliminated(game, player);

      if (!playerHasEliminated && !playerEliminated()) {
        game.eliminatePlayer(player);
      }
    }
  }

  protected checkPlayerEliminated(game: Readonly<Game>, player: number): boolean {
    return this.checkPlayerHasMove(game, player);
  }

  protected checkPlayerHasMove(game: Readonly<Game>, player: number): boolean {
    const allPlayersHasFirstMove = game.moves.length >= game.numberOfPlayers;

    if (!allPlayersHasFirstMove) {
      return true;
    }

    const piece = { player };

    for (let x = 0; x < game.board.width; x++) {
      for (let y = 0; y < game.board.height; y++) {
        const coordinate = [x, y] as const;
        const move = { player, coordinate, piece };
        const coordinateUnused = game.board.pieces[x]![y] === null;
        const placementValid = () => this.checkPlacementValidAfterFirstMove(game, move);

        if (coordinateUnused && placementValid()) {
          return true;
        }
      }
    }

    return false;
  }

  protected changeNextPlayerOrEndGame(game: Readonly<Game>) {
    try {
      return this.changeNextPlayer(game);
    } catch {
      return this.endGame(game);
    }
  }

  protected changeNextPlayer(game: Game): void {
    const isPlayerEliminated = (player: number) => game.eliminatedPlayers.includes(player);
    const nextPlayers = game.nextPlayers().filter(isPlayerEliminated);

    if (nextPlayers.length === 0) {
      throw new Error('沒有下一位玩家了');
    }

    const [nextPlayer] = nextPlayers as [number];
    game.changeCurrentPlayer(nextPlayer);
  }

  protected endGame(game: Game): void {
    const numberOfSurvivingPlayers = game.numberOfPlayers - game.eliminatedPlayers.length;

    if (numberOfSurvivingPlayers > 1) {
      throw new Error('無法結束遊戲，存活玩家超過一人');
    }

    const currentPlayerEliminated = game.eliminatedPlayers.includes(game.currentPlayer);
    const winner = !currentPlayerEliminated ? game.currentPlayer : undefined;
    game.endByWinner(winner);
  }
}

export default BaseGameManager;
