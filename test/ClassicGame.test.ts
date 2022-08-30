import Relati from "../src";

const P = Relati.createPosition;

let game: ReturnType<typeof Relati.createClassicGame>;

describe("2 名玩家在經典模式的開局", () => {
  beforeEach(() => {
    game = Relati.createClassicGame(2);
  });

  describe("假設在這個情境下", () => {
    test("棋盤大小應該要是 5x5", () => {
      expect(game.board.width).toBe(5);
      expect(game.board.height).toBe(5);
    });

    test("當玩家O下子在C3時，C3應該要有棋子O，並且輪到玩家X", () => {
      game.executeTurnByPlacePiece("O", "C3");
      expect(game.board.squareAt(P`C3`).piece?.symbol).toBe("O");
      expect(game.activePlayer.pieceSymbol).toBe("X");
    });

    test("當玩家O下子在s-7時，會因為座標無法解析而出錯", () => {
      expect(() => game.executeTurnByPlacePiece("O", "s-7")).toThrow();
    });

    test("當玩家O下子在Z8時，會因為格子不存在而出錯", () => {
      expect(() => game.executeTurnByPlacePiece("O", "Z8")).toThrow();
    });
  });

  describe("假設玩家O已經下子在了C3", () => {
    beforeEach(() => {
      game.executeTurnByPlacePiece("O", "C3");
    });

    test("當玩家X下子在B2時，B2應該要有棋子X，並且輪到玩家O，而且玩家都放過棋子了", () => {
      game.executeTurnByPlacePiece("X", "B2");
      expect(game.board.squareAt(P`B2`).piece?.symbol).toBe("X");
      expect(game.activePlayer.pieceSymbol).toBe("O");
      expect(game.allPlayersHavePiece).toBe(true);
    });

    test("當玩家X下子在C3時，會因為已經有棋子而出錯", () => {
      expect(() => game.executeTurnByPlacePiece("X", "C3")).toThrow();
    });
  });

  describe("假設玩家O放C3，玩家X放D3", () => {
    beforeEach(() => {
      game.executeTurnByPlacePiece("O", "C3");
      game.executeTurnByPlacePiece("X", "D3");
    });

    test("當玩家O下子在D2時，D2應該要有棋子O", () => {
      game.executeTurnByPlacePiece("O", "D2");
      expect(game.board.squareAt(P`D2`).piece?.symbol).toBe("O");
    });

    test("當玩家X下子在D2時，會因為不是玩家X的回合而出錯", () => {
      expect(() => game.executeTurnByPlacePiece("X", "D2")).toThrow();
    });

    test("當玩家O下子在D1時，會因為附近沒有符號，無法聯繫而出錯", () => {
      expect(() => game.executeTurnByPlacePiece("O", "D1")).toThrow();
    });
  });

  describe("假設玩家O放C3，玩家X放D3，玩家O放D2", () => {
    beforeEach(() => {
      game.executeTurnByPlacePiece("O", "C3");
      game.executeTurnByPlacePiece("X", "D3");
      game.executeTurnByPlacePiece("O", "D2");
    });

    test("當玩家X下子在C2時，C2應該要有棋子X", () => {
      game.executeTurnByPlacePiece("X", "C2");
      expect(game.board.squareAt(P`C2`).piece?.symbol).toBe("X");
    });

    test("當玩家X下子在D2時，會因為已經有棋子而出錯", () => {
      expect(() => game.executeTurnByPlacePiece("X", "D2")).toThrow();
    });

    test("當玩家X下子在C1時，會因為附近沒有符號，無法聯繫而出錯", () => {
      expect(() => game.executeTurnByPlacePiece("X", "C1")).toThrow();
    });
  });

  describe("假設玩家O放棄遊戲", () => {
    beforeEach(() => {
      game.handlePlayerAbstain("O");
    });

    test("當玩家X隨意下子時，遊戲結束，贏家會是玩家X", () => {
      game.executeTurnByPlacePiece("X", "C3");
      expect(game.ended).toBe(true);
      expect(game.winner?.pieceSymbol).toBe("X");
    });

    test("當玩家X也放棄遊戲時，遊戲結束，沒有贏家", () => {
      game.handlePlayerAbstain("X");
      expect(game.ended).toBe(true);
      expect(game.winner).toBeNull();
    });
  });
});

describe("2 名玩家在經典模式的殘局", () => {
  beforeEach(() => {
    game = Relati.createClassicGame(2);
  });

  describe("假設玩家X一開始放在左上角，被玩家O壓制，幾步後呈現兩條，輪到玩家X，且剩一步", () => {
    beforeEach(() => {
      const positions = ["B1", "A1", "B2", "A2", "B3", "A3", "B4", "A4", "B5"];
      positions.forEach((position) => game.executeTurnByPlacePiece(game.activePlayer.pieceSymbol, position));
    });

    test("當玩家X下子在A5時，遊戲還不會結束，也還沒有贏家，因為還有玩家能下子", () => {
      game.executeTurnByPlacePiece("X", "A5");
      expect(game.ended).toBe(false);
      expect(game.winner).toBeNull();
    });
  });

  describe("假設玩家X一開始放在左上角，被玩家O壓制，幾步後呈現兩條，玩家X已下完最後一步", () => {
    beforeEach(() => {
      const positions = ["B1", "A1", "B2", "A2", "B3", "A3", "B4", "A4", "B5", "A5"];
      positions.forEach((position) => game.executeTurnByPlacePiece(game.activePlayer.pieceSymbol, position));
    });

    test("當玩家O下子在C1時，遊戲結束，贏家會是玩家O，因為只剩自己能下子了", () => {
      game.executeTurnByPlacePiece("O", "C1");
      expect(game.ended).toBe(true);
      expect(game.winner?.pieceSymbol).toBe("O");
    });
  });

  describe("假設玩家交錯的下子，欲將盤面呈現類似西洋棋盤的樣式，輪到玩家O，且剩一步", () => {
    beforeEach(() => {
      const positions = [
        ["A1", "B1", "B2", "A2", "A3", "B3", "B4", "A4", "A5", "B5"],
        ["C5", "C4", "C3", "C2", "C1"],
        ["D1", "D2", "D3", "D4", "D5"],
        ["E5", "E4", "E3", "E2"],
      ].flat();

      positions.forEach((position) => game.executeTurnByPlacePiece(game.activePlayer.pieceSymbol, position));
    });

    test("當玩家O下子在E1時，遊戲結束，沒有贏家", () => {
      game.executeTurnByPlacePiece("O", "E1");
      expect(game.ended).toBe(true);
      expect(game.winner).toBeNull();
    });
  });
});

describe("3 名玩家在經典模式的開局", () => {
  beforeEach(() => {
    game = Relati.createClassicGame(3);
  });

  describe("假設在這個情境下", () => {
    test("棋盤大小應該要是 7x7", () => {
      expect(game.board.width).toBe(7);
      expect(game.board.height).toBe(7);
    });
  });

  describe("假設玩家O放D4，玩家X放E4", () => {
    beforeEach(() => {
      game.executeTurnByPlacePiece("O", "D4");
      game.executeTurnByPlacePiece("X", "E4");
    });

    test("當玩家D下子在E5時，E5應該要有棋子D，並且輪到玩家O，而且玩家都放過棋子了", () => {
      game.executeTurnByPlacePiece("D", "E5");
      expect(game.board.squareAt(P`E5`).piece?.symbol).toBe("D");
      expect(game.activePlayer.pieceSymbol).toBe("O");
      expect(game.allPlayersHavePiece).toBe(true);
    });
  });
});
