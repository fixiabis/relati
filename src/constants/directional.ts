const F: Coordinate = [+0, -1];
const B: Coordinate = [+0, +1];
const L: Coordinate = [-1, +0];
const R: Coordinate = [+1, +0];
const FL: Coordinate = [-1, -1];
const FR: Coordinate = [+1, -1];
const BL: Coordinate = [-1, +1];
const BR: Coordinate = [+1, +1];
const FF: Coordinate = [+0, -2];
const BB: Coordinate = [+0, +2];
const LL: Coordinate = [-2, +0];
const RR: Coordinate = [+2, +0];
const FFL: Coordinate = [-1, -2];
const FFR: Coordinate = [+1, -2];
const BBL: Coordinate = [-1, +2];
const BBR: Coordinate = [+1, +2];
const FLL: Coordinate = [-2, -1];
const FRR: Coordinate = [+2, -1];
const BLL: Coordinate = [-2, +1];
const BRR: Coordinate = [+2, +1];
const FFLL: Coordinate = [-2, -2];
const FFRR: Coordinate = [+2, -2];
const BBLL: Coordinate = [-2, +2];
const BBRR: Coordinate = [+2, +2];

export const CANNON_ATTACK_DIRECTIONS = [F, B, L, R];

export const CLASSIC_PATHS = [F, B, L, R, FL, FR, BL, BR].map((direction) => [direction]);

export const MODERN_PATHS = [
  ...CLASSIC_PATHS,

  [FF, F],
  [BB, B],
  [LL, L],
  [RR, R],

  [FFLL, FL],
  [FFRR, FR],
  [BBLL, BL],
  [BBRR, BR],

  [FFL, FF, F],
  [FFR, FF, F],
  [BBL, BB, B],
  [BBR, BB, B],

  [FLL, LL, L],
  [FRR, RR, R],
  [BLL, LL, L],
  [BRR, RR, R],

  [FFL, FL, F],
  [FFR, FR, F],
  [BBL, BL, B],
  [BBR, BR, B],

  [FLL, FL, L],
  [FRR, FR, R],
  [BLL, BL, L],
  [BRR, BR, R],

  [FLL, FL, F],
  [FRR, FR, F],
  [BLL, BL, B],
  [BRR, BR, B],

  [FFL, FL, L],
  [FFR, FR, R],
  [BBL, BL, L],
  [BBR, BR, R],
];
