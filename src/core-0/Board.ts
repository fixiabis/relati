import type Piece from './Piece';
import type { Coordinate } from './types';

function createInitialPieces(width: number, height: number) {
  return Array.from({ length: width }).map<null[]>(() => Array(height).fill(null));
}

export type BoardPieces = readonly (readonly (Readonly<Piece> | null)[])[];

export interface BoardProps {
  width: number;
  height?: number;
  pieces?: BoardPieces;
}

class Board {
  public readonly width: number;
  public readonly height: number;
  public readonly pieces: BoardPieces;

  constructor(props: BoardProps) {
    this.width = props.width;
    this.height = props.height || props.width;
    this.pieces = props.pieces || createInitialPieces(this.width, this.height);
  }

  public placePiece(coordinate: Coordinate, piece: Readonly<Piece>): Board {
    const pieces = this.pieces.map((pieces) => [...pieces]);
    const [x, y] = coordinate;
    pieces[x]![y] = piece;
    return new Board({ ...this.toProps(), pieces });
  }

  public hasCoordinate(coordinate: Coordinate): boolean {
    const [x, y] = coordinate;
    return x > -1 && x < this.width && y > -1 && y < this.height;
  }

  public updatePieces(pieces: BoardPieces): Board {
    return new Board({ ...this.toProps(), pieces });
  }

  protected toProps(): BoardProps {
    return { ...this };
  }
}

export default Board;
