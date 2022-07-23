import { Board } from '../../board';
import { RelativeCoordinate } from '../../coordinates';
import { Game, GameInit } from './Game';
import { Player } from '../../players';
import { BoardSquare } from '../../board';

const nearbyRelativeCoordinates = ['F', 'B', 'L', 'R', 'FL', 'FR', 'BL', 'BR'].map(RelativeCoordinate.parse);

export interface ClassicGameInit extends GameInit {
  board?: Board;
}

export class ClassicGame extends Game {
  constructor(players: Player[], init: ClassicGameInit = {}) {
    const boardSize = players.length * 2 + 1;
    super(players, init.board || new Board(boardSize), init);
  }

  protected canPlacePiece(player: Player, square: BoardSquare): boolean {
    return nearbyRelativeCoordinates
      .filter((coordinate) => square.squareDefinedTo(coordinate))
      .map((coordinate) => square.squareTo(coordinate).piece)
      .some((piece) => piece?.symbol === player.pieceSymbol);
  }
}
