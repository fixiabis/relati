import { Coordinate } from '../primitives';

export interface GameMove {
  player: number;
  type?: string;
  coordinate?: Coordinate;
}

export interface Placement extends GameMove {
  type?: 'placement';
  coordinate: Coordinate;
}

export function isPlacement(move: GameMove): move is Placement {
  return (move.type || 'placement') === 'placement' && move.coordinate !== undefined;
}
