import { Board } from '../../board';
import { RelativeCoordinate } from '../../coordinates';
import { Piece } from '../../piece';
import { Player } from '../../players/proto-1/Player';
import { Game, GameInit } from './Game';

const nearbyRelativeCoordinates = ['F', 'B', 'L', 'R', 'FL', 'FR', 'BL', 'BR'].map(RelativeCoordinate.parse);

export interface ClassicGameInit extends GameInit {
  board?: Board;
  rootPlacing?: false;
}

export class ClassicGame extends Game {
  constructor(players: Player<Game>[], init: ClassicGameInit) {
    const boardSize = players.length * 2 + 1;
    init.rootPlacing = false;

    super(players, init.board || new Board(boardSize), init);
  }

  protected pieceCanPlace(piece: Piece): boolean {
    const nearbySquares = nearbyRelativeCoordinates
      .filter((coordinate) => piece.square.squareDefinedTo(coordinate))
      .map((coordinate) => piece.square.squareTo(coordinate));

    return nearbySquares.some((square) => square.piece?.symbol === piece.symbol);
  }
}
