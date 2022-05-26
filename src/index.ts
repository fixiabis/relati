import RoughGuyAI from './example/ai-players/RoughGuy';
import TypeAlphaAI from './example/ai-players/TypeAlpha';

export { default as Game } from './core-0/Game';

export namespace AIPlayer {
  export const RoughGuy = RoughGuyAI;
  export const TypeAlpha = TypeAlphaAI;
}
