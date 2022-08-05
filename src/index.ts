import { ClassicGame } from "./classic-game/Game";
import { Piece } from "./core/Piece";
import { Player } from "./core/Player";

namespace Relati {
  function createPlayers(numberOfPlayers: number): Player[] {
    return Piece.AllSymbols.slice(0, numberOfPlayers).map((pieceSymbol) => new Player(pieceSymbol));
  }

  export function createClassicGame(numberOfPlayers: number) {
    return new ClassicGame(createPlayers(numberOfPlayers));
  }

  export function createModernGame(numberOfPlayers: number) {}
}

export default Relati;
