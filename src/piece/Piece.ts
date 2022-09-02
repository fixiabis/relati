import { BoardSquare } from "../board/BoardSquare";
import { PieceRelation } from "./PieceRelation";

export interface PieceInit {
  isRoot?: boolean;
  relations?: PieceRelation[];
  receivedRelation?: PieceRelation | null;
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
    this.receivedRelation = init.receivedRelation || null;
  }

  public get disabled(): boolean {
    return this.receivedRelation === null;
  }

  public receiveRelation(relation: PieceRelation): void {
    this.receivedRelation = relation;
  }

  public sendRelations(): void {
    for (const relation of this.familiarRelations) {
      if (relation.receiver!.disabled) {
        relation.receiver!.receiveRelation(relation);
      }
    }
  }

  private get familiarRelations(): PieceRelation[] {
    return this.relations
      .filter((relation) => !relation.blocked)
      .filter((relation) => relation.receiver?.symbol === this.symbol);
  }
}

export type PieceSymbol = typeof Piece.AllSymbols[number];
