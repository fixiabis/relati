import { DirectionCoordinate } from '../../core/coordinates/DirectionCoordinate';

export const DirectionPaths = [
  ['F'],
  ['B'],
  ['L'],
  ['R'],

  ['FL'],
  ['FR'],
  ['BL'],
  ['BR'],

  ['FF', 'F'],
  ['BB', 'B'],
  ['LL', 'L'],
  ['RR', 'R'],

  ['FFLL', 'FL'],
  ['FFRR', 'FR'],
  ['BBLL', 'BL'],
  ['BBRR', 'BR'],

  ['FFL', 'FF', 'F'],
  ['FFR', 'FF', 'F'],
  ['BBL', 'BB', 'B'],
  ['BBR', 'BB', 'B'],

  ['FLL', 'LL', 'L'],
  ['FRR', 'RR', 'R'],
  ['BLL', 'LL', 'L'],
  ['BRR', 'RR', 'R'],

  ['FFL', 'FL', 'F'],
  ['FFR', 'FR', 'F'],
  ['BBL', 'BL', 'B'],
  ['BBR', 'BR', 'B'],

  ['FLL', 'FL', 'L'],
  ['FRR', 'FR', 'R'],
  ['BLL', 'BL', 'L'],
  ['BRR', 'BR', 'R'],

  ['FLL', 'FL', 'F'],
  ['FRR', 'FR', 'F'],
  ['BLL', 'BL', 'B'],
  ['BRR', 'BR', 'B'],

  ['FFL', 'FL', 'L'],
  ['FFR', 'FR', 'R'],
  ['BBL', 'BL', 'L'],
  ['BBR', 'BR', 'R'],
].map((codes) => codes.map(DirectionCoordinate.parse));
