import ClassicGameManager from './core/managers/ClassicGameManager';
import GameManager from './core/managers/GameManager';
import ModernGameManager from './core/managers/ModernGameManager';

type GameMode = 'modern' | 'classic';

const gameManagers: Record<GameMode, GameManager> = {
  classic: new ClassicGameManager(),
  modern: new ModernGameManager(),
};

interface GameOptions {
  mode?: GameMode;
}

export async function createGame(numberOfPlayers: number, options: GameOptions) {
  const gameManager = gameManagers[options.mode || 'modern'];
  return gameManager.createGame(numberOfPlayers);
}
