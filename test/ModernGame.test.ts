import Relati from "../src";
import { Position } from "../src/core-1/Position";

const P = Position.ofCode;

let game: ReturnType<typeof Relati.createModernGame>;

describe("2 名玩家在流行模式的開局", () => {
  beforeEach(() => {
    game = Relati.createModernGame(2);
  });

  describe("假設在這個情境下", () => {
    test("棋盤大小應該要是 9x9", () => {
      expect(game.board.width).toBe(9);
      expect(game.board.height).toBe(9);
    });

    test("當玩家O下子在E5時，E5應該要有棋子O，並且輪到玩家X", () => {
      game.placePiece("O", "E5");
      expect(game.board.squareAt(P`E5`).piece?.symbol).toBe("O");
      expect(game.activePlayer.pieceSymbol).toBe("X");
    });

    test("當玩家O下子在s-7時，會因為座標無法解析而出錯", () => {
      expect(() => game.placePiece("O", "s-7")).toThrow();
    });

    test("當玩家O下子在Z8時，會因為格子不存在而出錯", () => {
      expect(() => game.placePiece("O", "Z8")).toThrow();
    });
  });

  describe("假設玩家O放E5，玩家X放F5", () => {
    beforeEach(() => {
      game.placePiece("O", "E5");
      game.placePiece("X", "F5");
    });

    test("當玩家O下子在C3時，C3應該要有棋子O", () => {
      game.placePiece("O", "C3");
      expect(game.board.squareAt(P`C3`).piece?.symbol).toBe("O");
    });

    test("當玩家X下子在E3時，會因為不是玩家X的回合而出錯", () => {
      expect(() => game.placePiece("X", "E3")).toThrow();
    });

    test("當玩家O下子在D1時，會因為附近沒有符號，無法聯繫而出錯", () => {
      expect(() => game.placePiece("O", "D1")).toThrow();
    });
  });

  describe("假設玩家O放E5，玩家X放F5，玩家O放C3", () => {
    beforeEach(() => {
      game.placePiece("O", "E5");
      game.placePiece("X", "F5");
      game.placePiece("O", "C3");
    });

    test("當玩家X下子在D4時，D4應該要有棋子X，且C3的棋子O會失效", () => {
      game.placePiece("X", "D4");
      expect(game.board.squareAt(P`D4`).piece?.symbol).toBe("X");
      expect(game.board.squareAt(P`C3`).piece?.disabled).toBe(true);
    });

    test("當玩家X下子在E5時，會因為已經有棋子而出錯", () => {
      expect(() => game.placePiece("X", "E5")).toThrow();
    });

    test("當玩家X下子在C1時，會因為附近沒有符號，無法聯繫而出錯", () => {
      expect(() => game.placePiece("X", "C1")).toThrow();
    });
  });

  describe("假設玩家O放E5，玩家X放F5，玩家O放C3，玩家X放D4", () => {
    beforeEach(() => {
      game.placePiece("O", "E5");
      game.placePiece("X", "F5");
      game.placePiece("O", "C3");
      game.placePiece("X", "D4");
    });

    test("當玩家O下子在C5時，C5應該要有棋子O，且C3的棋子O會恢復", () => {
      game.placePiece("O", "C5");
      expect(game.board.squareAt(P`C5`).piece?.symbol).toBe("O");
      expect(game.board.squareAt(P`C3`).piece?.disabled).toBe(false);
    });
  });
});

describe("2 名玩家在流行模式的殘局", () => {
  beforeEach(() => {
    game = Relati.createModernGame(2);
  });

  describe("假設玩家O發瘋，從角落開始，而且只用遠程的連線，下了三子，現在輪到玩家X", () => {
    beforeEach(() => {
      const positions = ["A1", "B1", "C3", "B2", "A3"];
      positions.forEach((position) => game.placePiece(game.activePlayer.pieceSymbol, position));
    });

    test("當玩家X下子在A2時，A2應該要有棋子X，且C3和A3的棋子O會失效，遊戲結束，贏家為玩家X", () => {
      game.placePiece("X", "A2");
      expect(game.board.squareAt(P`A2`).piece?.symbol).toBe("X");
      expect(game.board.squareAt(P`C3`).piece?.disabled).toBe(true);
      expect(game.board.squareAt(P`A3`).piece?.disabled).toBe(true);
      expect(game.ended).toBe(true);
      expect(game.winner?.pieceSymbol).toBe("X");
    });
  });

  describe("假設玩家交錯的下子，欲將盤面呈現類似西洋棋盤的樣式，輪到玩家O，且剩一步", () => {
    beforeEach(() => {
      const positions = [
        ["A1", "B1", "B2", "A2", "A3", "B3", "B4", "A4", "A5", "B5", "B6", "A6", "A7", "B7", "A8", "B8", "B9", "A9"],
        ["C9", "C8", "C7", "C6", "C5", "C4", "C3", "C2", "C1"],
        ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"],
        ["E9", "E8", "E7", "E6", "E5", "E4", "E3", "E2", "E1"],
        ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"],
        ["G9", "G8", "G7", "G6", "G5", "G4", "G3", "G2", "G1"],
        ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9"],
        ["I9", "I8", "I7", "I6", "I5", "I4", "I3", "I2"],
      ].flat();

      positions.forEach((position) => game.placePiece(game.activePlayer.pieceSymbol, position));
    });

    test("當玩家O下子在I1時，遊戲結束，沒有贏家", () => {
      game.placePiece("O", "I1");
      expect(game.ended).toBe(true);
      expect(game.winner).toBeNull();
    });
  });
});

/*
describe('2 名玩家在有額外動作的流行模式下的開局', () => {
  let game: ReturnType<typeof Relati.createModernGame>;

  beforeEach(() => {
    game = Relati.createModernGame(2);
  });

  describe('假設在這個情境下', () => {
    test('棋盤大小應該要是 9x9', () => {
      expect(game.board.width).toBe(9);
      expect(game.board.height).toBe(9);
    });

    test('當玩家O下子在E5時，E5應該要有棋子O，並且輪到玩家X', () => {
      game.placePiece('O', 'E5');
      expect(game.board.squareAt(P`E5`).piece?.symbol).toBe('O');
      expect(game.activePlayer.pieceSymbol).toBe('X');
    });

    test('當玩家O下子在s-7時，會因為座標無法解析而出錯', () => {
      expect(() => game.placePiece('O', 's-7')).toThrow();
    });

    test('當玩家O下子在Z8時，會因為格子不存在而出錯', () => {
      expect(() => game.placePiece('O', 'Z8')).toThrow();
    });
  });

  describe('假設玩家O放E5，玩家X放F5', () => {
    beforeEach(() => {
      game.placePiece('O', 'E5');
      game.placePiece('X', 'F5');
    });

    test('當玩家O下子在C3時，C3應該要有棋子O', () => {
      game.placePiece('O', 'C3');
      expect(game.board.squareAt(P`C3`).piece?.symbol).toBe('O');
    });

    test('當玩家X下子在E3時，會因為不是玩家X的回合而出錯', () => {
      expect(() => game.placePiece('X', 'E3')).toThrow();
    });

    test('當玩家O下子在D1時，會因為附近沒有符號，無法聯繫而出錯', () => {
      expect(() => game.placePiece('O', 'D1')).toThrow();
    });
  });

  describe('假設玩家O放E5，玩家X放F5，玩家O放C3', () => {
    beforeEach(() => {
      game.placePiece('O', 'E5');
      game.placePiece('X', 'F5');
      game.placePiece('O', 'C3');
    });

    test('當玩家X下子在D4時，D4應該要有棋子X，且C3的棋子O會失效，玩家X還有一步可以動', () => {
      game.placePiece('X', 'D4');
      expect(game.board.squareAt(P`D4`).piece?.symbol).toBe('X');
      expect(game.board.squareAt(P`C3`).piece?.disabled).toBe(true);
      expect(game.activePlayer.pieceSymbol).toBe('X');
      expect(game.activePlayer.movesRemaining).toBe(1);
    });

    test('當玩家X下子在E5時，會因為已經有棋子而出錯', () => {
      expect(() => game.placePiece('X', 'E5')).toThrow();
    });

    test('當玩家X下子在C1時，會因為附近沒有符號，無法聯繫而出錯', () => {
      expect(() => game.placePiece('X', 'C1')).toThrow();
    });

    test('當玩家X放棄剩下的動作時，會因為這回合沒有動作而出錯', () => {
      expect(() => game.abandonRemainingMoves('X')).toThrow();
    });
  });

  describe('假設玩家O放E5，玩家X放F5，玩家O放C3，玩家X放D4', () => {
    beforeEach(() => {
      game.placePiece('O', 'E5');
      game.placePiece('X', 'F5');
      game.placePiece('O', 'C3');
      game.placePiece('X', 'D4');
    });

    test('當玩家O下子在C5時，會因為不是玩家O的回合而出錯', () => {
      expect(() => game.placePiece('O', 'C5')).toThrow();
    });

    test('當玩家X下子在D5時，D5應該要有棋子X，並且輪到玩家O', () => {
      game.placePiece('X', 'D5');
      expect(game.board.squareAt(P`D5`).piece?.symbol).toBe('X');
      expect(game.activePlayer.pieceSymbol).toBe('O');
    });

    test('當玩家X放棄剩下的動作時，應該輪到玩家O', () => {
      game.abandonRemainingMoves('X');
      expect(game.activePlayer.pieceSymbol).toBe('O');
    });
  });
});
 */
