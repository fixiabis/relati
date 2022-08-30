import { BoardSquare } from "../board/BoardSquare";
import { PieceRelation } from "./PieceRelation";

export interface PieceInit {
  isRoot?: boolean;
  relations?: PieceRelation[];
  receivedRelations?: PieceRelation[];
  primaryRelation?: PieceRelation | null;
}

export class Piece {
  public static readonly AllSymbols = ["O", "X", "D", "R", "A", "H"] as const;
  public readonly symbol: PieceSymbol;
  public readonly square: BoardSquare<Piece>;
  public readonly isRoot: boolean;
  public readonly relations: PieceRelation[];
  public receivedRelations: PieceRelation[];
  public primaryRelation: PieceRelation | null;

  constructor(symbol: PieceSymbol, square: BoardSquare<Piece>, init: PieceInit = {}) {
    this.symbol = symbol;
    this.square = square;
    this.isRoot = init.isRoot || false;
    this.relations = init.relations || [];
    this.receivedRelations = init.receivedRelations || [];
    this.primaryRelation = init.primaryRelation || null;
  }

  public get disabled(): boolean {
    return this.primaryRelation === null;
  }

  public receiveRelation(relation: PieceRelation): void {
    if (!this.receivedRelations.includes(relation)) {
      this.receivedRelations.push(relation);
    }

    this.primaryRelation = relation;
  }
}

export type PieceSymbol = typeof Piece.AllSymbols[number];
