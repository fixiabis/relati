import { Game } from './Game';
import { ClassicMode } from './modes/ClassicMode';
import { ExtraMoveMode } from './modes/ExtraMoveMode';
import { GameMode } from './modes/GameMode';
import { ModernMode } from './modes/ModernMode';
import { Piece } from './piece/Piece';
import { Player } from './players/Player';

namespace Relati {
  function createPlayers(numberOfPlayers: number): Player[] {
    return Piece.AllSymbols.slice(0, numberOfPlayers).map((pieceSymbol) => new Player(pieceSymbol));
  }

  export function createClassicGame(numberOfPlayers: number): Game {
    const players = createPlayers(numberOfPlayers);
    const mode = new ClassicMode();
    return new Game(mode, players);
  }

  export function createModernGame(numberOfPlayers: number, extraMoveUsed?: boolean): Game {
    const players = createPlayers(numberOfPlayers);
    const mode: GameMode = new ModernMode();
    return new Game(extraMoveUsed ? new ExtraMoveMode(mode) : mode, players);
  }
}

export default Relati;
