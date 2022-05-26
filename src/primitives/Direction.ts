import type Coordinate from './Coordinate';

function Direction(code: string | string[] | TemplateStringsArray): Coordinate {
  if ((Direction as DirectionParser)[code as CommonCode]) {
    return (Direction as DirectionParser)[code as CommonCode];
  }

  let [dx, dy] = [0, 0];

  for (const type of Array.from(code)) {
    if (type === 'F') {
      dy--;
    }

    if (type === 'B') {
      dy++;
    }

    if (type === 'L') {
      dx--;
    }

    if (type === 'R') {
      dx++;
    }
  }

  return [dx, dy];
}

type CommonCode = Exclude<`${'' | 'F' | 'B' | 'FF' | 'BB'}${'' | 'L' | 'R' | 'LL' | 'RR'}`, ''>;

const commonCodes: CommonCode[] = ['', 'F', 'B', 'FF', 'BB']
  .reduce((codes, yType) => codes.concat(['', 'L', 'R', 'LL', 'RR'].map((xType) => yType + xType)), [] as string[])
  .filter((code): code is CommonCode => code !== '');

type DirectionParser = typeof Direction & { [code in CommonCode]: Coordinate };

for (const commonCode of commonCodes) {
  (Direction as DirectionParser)[commonCode] = Direction(commonCode);
}

export default Direction as DirectionParser;
