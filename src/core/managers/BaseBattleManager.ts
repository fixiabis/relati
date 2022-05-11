import Battle from '../Battle';
import Move from '../moves/Move';
import Placement, { isPlacement } from '../moves/Placement';
import BattleManager from './BattleManager';

abstract class BaseBattleManager implements BattleManager {
  public abstract createBattle(numberOfPlayers: number): Readonly<Battle>;

  protected judgePlacement(battle: Readonly<Battle>, move: Placement): void {
    if (!battle.board.hasCoordinate(move.coordinate)) {
      throw new Error('放置座標不存在');
    }

    const [x, y] = move.coordinate;
    const coordinateHasTaken = battle.board.pieces[x]![y] !== null;

    if (coordinateHasTaken) {
      throw new Error('放置座標已被使用');
    }

    this.judgePlacementValid(battle, move);
  }

  protected judgePlacementValid(battle: Readonly<Battle>, move: Placement): void {
    const allPlayersHasFirstMove = battle.moves.length >= battle.numberOfPlayers;

    if (!allPlayersHasFirstMove) {
      return;
    }

    const placementValid = this.checkPlacementValidAfterFirstMove(battle, move);

    if (!placementValid) {
      throw new Error('放置不符規則');
    }
  }

  protected abstract checkPlacementValidAfterFirstMove(battle: Readonly<Battle>, move: Placement): boolean;

  protected judgeMove(battle: Readonly<Battle>, move: Move): void {
    if (move.player !== battle.currentPlayer) {
      throw new Error('行動方不為目前玩家');
    }

    if (isPlacement(move)) {
      return this.judgePlacement(battle, move);
    }
  }

  public addMoveInBattle(battle: Readonly<Battle>, move: Move): void {
    this.judgeMove(battle, move);
    battle.addMove(move);
    this.prepareNextTurn(battle);
  }

  protected prepareNextTurn(battle: Readonly<Battle>): void {
    this.eliminatePlayers(battle);
    this.changeNextPlayerOrEndBattle(battle);
  }

  protected eliminatePlayers(battle: Readonly<Battle>): void {
    for (let player = 0; player < battle.numberOfPlayers; player++) {
      const playerHasEliminated = battle.eliminatedPlayers.includes(player);
      const playerEliminated = () => this.checkPlayerEliminated(battle, player);

      if (!playerHasEliminated && !playerEliminated()) {
        battle.eliminatePlayer(player);
      }
    }
  }

  protected checkPlayerEliminated(battle: Readonly<Battle>, player: number): boolean {
    return this.checkPlayerHasMove(battle, player);
  }

  protected checkPlayerHasMove(battle: Readonly<Battle>, player: number): boolean {
    const allPlayersHasFirstMove = battle.moves.length >= battle.numberOfPlayers;

    if (!allPlayersHasFirstMove) {
      return true;
    }

    const piece = { player };

    for (let x = 0; x < battle.board.width; x++) {
      for (let y = 0; y < battle.board.height; y++) {
        const coordinate = [x, y] as const;
        const move = { player, coordinate, piece };
        const coordinateUnused = battle.board.pieces[x]![y] === null;
        const placementValid = () => this.checkPlacementValidAfterFirstMove(battle, move);

        if (coordinateUnused && placementValid()) {
          return true;
        }
      }
    }

    return false;
  }

  protected changeNextPlayerOrEndBattle(battle: Readonly<Battle>) {
    try {
      return this.changeNextPlayer(battle);
    } catch {
      return this.endBattle(battle);
    }
  }

  protected changeNextPlayer(battle: Battle): void {
    const isPlayerEliminated = (player: number) => battle.eliminatedPlayers.includes(player);
    const nextPlayers = battle.nextPlayers().filter(isPlayerEliminated);

    if (nextPlayers.length === 0) {
      throw new Error('沒有下一位玩家了');
    }

    const [nextPlayer] = nextPlayers as [number];
    battle.changeCurrentPlayer(nextPlayer);
  }

  protected endBattle(battle: Battle): void {
    const numberOfSurvivingPlayers = battle.numberOfPlayers - battle.eliminatedPlayers.length;

    if (numberOfSurvivingPlayers > 1) {
      throw new Error('無法結束遊戲，存活玩家超過一人');
    }

    const currentPlayerEliminated = battle.eliminatedPlayers.includes(battle.currentPlayer);
    const winner = !currentPlayerEliminated ? battle.currentPlayer : undefined;
    battle.endByWinner(winner);
  }
}

export default BaseBattleManager;
