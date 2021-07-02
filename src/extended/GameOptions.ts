import GameOptionsBase from '../modern/GameOptions';

interface GameOptions extends GameOptionsBase {
  isComboActionActive?: boolean;
  isCannonActive?: boolean;
  isComboCannonAttackActive?: boolean;
  isRootMovementActive?: boolean;
}

export default GameOptions;
