import Battle from '../Battle';
import Move from '../moves/Move';

interface BattleManager {
  createBattle(numberOfPlayers: number): Readonly<Battle>;
  addMoveInBattle(battle: Readonly<Battle>, move: Move): void;
}

export default BattleManager;
