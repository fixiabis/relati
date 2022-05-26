type Coordinate = readonly [number, number];

function Coordinate(value: number): Coordinate;
function Coordinate(x: number, y: number): Coordinate;
function Coordinate(x: number, y?: number): Coordinate {
  if (typeof y === 'undefined') {
    return Coordinate.fromValue(x);
  }

  return [x, y];
}

namespace Coordinate {
  export function value(coordinate: Coordinate): number {
    const [x, y] = coordinate;
    return (Math.abs(x) << 16) * Math.sign(x) + y;
  }

  export function fromValue(value: number): Coordinate {
    const x = value >> 16;
    const y = value & 65535;
    return [x, y];
  }

  function valueTypeA(coordinate: Coordinate): number {
    const [x, y] = coordinate;
    const shell = Math.max(x, y);
    const start = shell * shell;
    return start + shell + x - y;
  }

  function fromValueTypeA(index: number): Coordinate {
    const shell = Math.floor(Math.sqrt(index));
    const start = shell * shell;
    const n = index - start - shell;
    return [shell + Math.min(n, 0), shell - Math.max(n, 0)];
  }

  function valueTypeB(coordinate: Coordinate): number {
    const [x, y] = coordinate;
    const shell = Math.max(Math.abs(x) * 2 - +(x > 0), Math.abs(y) * 2 - +(y > 0));
    const shellBase = Math.ceil(shell / 2) * ((shell % 2) - ((shell + 1) % 2));
    const shellBaseSign = Math.sign(shellBase);
    const start = shell * shell;
    return start + shell + x * shellBaseSign - y * shellBaseSign;
  }

  function fromValueTypeB(index: number): Coordinate {
    const shell = Math.floor(Math.sqrt(index));
    const shellBase = Math.ceil(shell / 2) * ((shell % 2) - ((shell + 1) % 2));
    const shellBaseSign = Math.sign(shellBase);
    const start = shell * shell;
    const n = index - start - shell;
    return [shellBase + shellBaseSign * Math.min(n, 0), shellBase - shellBaseSign * Math.max(n, 0)];
  }
}

export default Coordinate;
