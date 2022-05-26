import type Coordinate from './Coordinate';

function createInitialPieces(width: number, height: number) {
  return Array.from({ length: width }).map<null[]>(() => Array(height).fill(null));
}

export interface BoardProps<T extends {}> {
  width: number;
  height?: number;
  values?: readonly (readonly (Readonly<T> | null)[])[];
}

class Board<T extends {}> {
  public readonly width: number;
  public readonly height: number;
  public readonly pieces: readonly (readonly (Readonly<T> | null)[])[];

  constructor(props: BoardProps<T>) {
    this.width = props.width;
    this.height = props.height || props.width;
    this.pieces = props.values || createInitialPieces(this.width, this.height);
  }

  public hasCoordinate(coordinate: Coordinate): boolean {
    const [x, y] = coordinate;
    return x > -1 && x < this.width && y > -1 && y < this.height;
  }

  public putPiece(coordinate: Coordinate, value: T): Board<T> {
    const [x, y] = coordinate;
    const values = this.pieces.map((values) => [...values]);
    values[x]![y] = value;
    return this.putAllPieces(values);
  }

  public putAllPieces(values: (T | null)[][]): Board<T> {
    return new Board<T>({ ...this, values });
  }
}

export default Board;
