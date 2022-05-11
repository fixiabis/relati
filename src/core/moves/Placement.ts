import Piece from '../Piece';
import type { Coordinate } from '../types';
import type Move from './Move';

interface Placement extends Move {
  type?: 'placement';
  coordinate: Coordinate;
  piece: Piece;
}

export function isPlacement(move: Move): move is Placement {
  return (move as Placement).coordinate !== undefined && (move.type || 'placement') === 'placement';
}

export default Placement;
