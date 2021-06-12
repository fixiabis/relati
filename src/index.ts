import ClassicBoard from './classic/Board';
import ClassicGame from './classic/Game';
import ClassicJudge from './classic/Judge';
import ClassicPlayer from './classic/Player';
import ModernBoard from './modern/Board';
import ModernGame from './modern/Game';
import ModernJudge from './modern/Judge';
import ModernPlayer from './modern/Player';

export namespace Classic {
  export const Board = ClassicBoard;
  export const Game = ClassicGame;
  export const Judge = ClassicJudge;
  export const Player = ClassicPlayer;
}

export namespace Modern {
  export const Board = ModernBoard;
  export const Game = ModernGame;
  export const Judge = ModernJudge;
  export const Player = ModernPlayer;
}
