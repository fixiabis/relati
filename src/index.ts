import { Board } from "./board/Board";
import { Game } from "./Game";
import { DirectionPaths } from "./DirectionPaths";
import { Piece } from "./piece/Piece";
import { Player } from "./Player";
import { Position } from "./positional/Position";

namespace Relati {
  export function createPosition(code: string | TemplateStringsArray): Position {
    return Position.parse([].join.call(code, ""));
  }

  function createPlayers(numberOfPlayers: number): Player[] {
    return Piece.AllSymbols.slice(0, numberOfPlayers).map((pieceSymbol) => new Player(pieceSymbol));
  }

  export function createClassicGame(numberOfPlayers: number) {
    const size = numberOfPlayers * 2 + 1;
    const board = new Board<Piece>(size);
    const players = createPlayers(numberOfPlayers);
    const game = new Game(players, board, DirectionPaths.Classic);
    return game;
  }

  export function createModernGame(numberOfPlayers: number) {
    const size = numberOfPlayers * 4 + 1;
    const board = new Board<Piece>(size);
    const players = createPlayers(numberOfPlayers);
    const game = new Game(players, board, DirectionPaths.Modern);
    return game;
  }
}

export default Relati;
