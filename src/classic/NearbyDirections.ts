import { DirectionCoordinate } from '../core/coordinates/DirectionCoordinate';

export const NearbyDirections = ['F', 'B', 'L', 'R', 'FL', 'FR', 'BL', 'BR'].map(DirectionCoordinate.parse);
