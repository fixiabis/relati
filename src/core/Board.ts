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
    const [x, y] = coordinate;
    const props = this.toProps();
    const pieces = this.pieces.map((pieces) => [...pieces]);
    pieces[x]![y] = piece;
    props.pieces = pieces;
    return new Board(props);
  }

  public hasCoordinate(coordinate: Coordinate): boolean {
    const [x, y] = coordinate;
    return x > -1 && x < this.width && y > -1 && y < this.height;
  }

  public updatePieces(pieces: BoardPieces): Board {
    const props = this.toProps();
    props.pieces = pieces;
    return new Board(props);
  }

  protected toProps(): BoardProps {
    return { width: this.width, height: this.height, pieces: this.pieces };
  }
}

export default Board;
