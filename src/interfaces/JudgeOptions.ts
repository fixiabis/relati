type LinkMode = 'classic' | 'modern';

interface JudgeOptions {
  linkMode: LinkMode;
  canUseComboAction: boolean;
  canUseCannon: boolean;
  // canUseComboCannon: boolean;
  // canMoveRoot: boolean;
}

export default JudgeOptions;
