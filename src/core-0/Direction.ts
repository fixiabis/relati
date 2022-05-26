namespace Direction {
  export const F = [0, -1] as const;
  export const B = [0, 1] as const;
  export const L = [-1, 0] as const;
  export const R = [1, 0] as const;
  export const FL = [-1, -1] as const;
  export const BL = [-1, 1] as const;
  export const FR = [1, -1] as const;
  export const BR = [1, 1] as const;
  export const FF = [+0, -2] as const;
  export const BB = [+0, +2] as const;
  export const LL = [-2, +0] as const;
  export const RR = [+2, +0] as const;
  export const FFL = [-1, -2] as const;
  export const FFR = [+1, -2] as const;
  export const BBL = [-1, +2] as const;
  export const BBR = [+1, +2] as const;
  export const FLL = [-2, -1] as const;
  export const FRR = [+2, -1] as const;
  export const BLL = [-2, +1] as const;
  export const BRR = [+2, +1] as const;
  export const FFLL = [-2, -2] as const;
  export const FFRR = [+2, -2] as const;
  export const BBLL = [-2, +2] as const;
  export const BBRR = [+2, +2] as const;
}

export default Direction;
