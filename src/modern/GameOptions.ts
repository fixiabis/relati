interface GameOptions {
  linkMode: 'classic' | 'modern';
}

export interface ClassicGameOptions extends GameOptions {
  linkMode: 'classic';
}

export interface ModernGameOptions extends GameOptions {
  linkMode: 'modern';
}

export default GameOptions;
