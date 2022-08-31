import { BoardSquare } from "../board/BoardSquare";
import { PieceRelation } from "./PieceRelation";

export interface PieceInit {
  isRoot?: boolean;
  relations?: PieceRelation[];
  primaryRelation?: PieceRelation | null;
}

export class Piece {
  public static readonly AllSymbols = ["O", "X", "D", "R", "A", "H"] as const;
  public readonly symbol: PieceSymbol;
  public readonly square: BoardSquare<Piece>;
  public readonly isRoot: boolean;
  public readonly relations: PieceRelation[];
  public receivedRelation: PieceRelation | null;

  constructor(symbol: PieceSymbol, square: BoardSquare<Piece>, init: PieceInit = {}) {
    this.symbol = symbol;
    this.square = square;
    this.isRoot = init.isRoot || false;
    this.relations = init.relations || [];
    this.receivedRelation = init.primaryRelation || null;
  }

  public get disabled(): boolean {
    return this.receivedRelation === null;
  }

  public receiveRelation(relation: PieceRelation): void {
    this.receivedRelation = relation;
  }
}

export type PieceSymbol = typeof Piece.AllSymbols[number];
