import { ClassicGame } from "./classic-game/Game";
import { Piece } from "./core-1/Piece";
import { Player } from "./core-1/Player";
import { ModernGame } from "./modern-game/Game";

namespace Relati {
  function createPlayers(numberOfPlayers: number): Player[] {
    return Piece.AllSymbols.slice(0, numberOfPlayers).map((pieceSymbol) => new Player(pieceSymbol));
  }

  export function createClassicGame(numberOfPlayers: number) {
    return new ClassicGame(createPlayers(numberOfPlayers));
  }

  export function createModernGame(numberOfPlayers: number) {
    return new ModernGame(createPlayers(numberOfPlayers));
  }
}

export default Relati;
