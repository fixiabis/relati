import { Board } from '../src/core/board/Board';
import { PositionCoordinate } from '../src/core/coordinates/PositionCoordinate';
import { Game } from '../src/core/Game';
import { Player } from '../src/core/Player';

const position = (strings: TemplateStringsArray) => PositionCoordinate.parse(strings.join(''));

let game: Game;

beforeEach(() => {
  const players = [new Player('O'), new Player('X')];
  const board = new Board(5, 5);
  game = new Game(players, { board });
});

describe('2 名玩家在 5x5 棋盤上的開局', () => {
  describe('假設在這個情境下', () => {
    test('當玩家O下子在C3時，C3應該要有棋子O，並且輪到玩家X', () => {
      game.placePiece('O', 'C3');
      expect(game.board.squareAt(position`C3`).piece?.symbol).toBe('O');
      expect(game.activePlayer.pieceSymbol).toBe('X');
    });

    test('當玩家O下子在s-7時，會因為座標無法解析而出錯', () => {
      expect(() => game.placePiece('O', 's-7')).toThrow();
    });

    test('當玩家O下子在Z8時，會因為格子不存在而出錯', () => {
      expect(() => game.placePiece('O', 'Z8')).toThrow();
    });
  });

  describe('假設玩家O已經下子在了C3', () => {
    beforeEach(() => {
      game.placePiece('O', 'C3');
    });

    test('當玩家X下子在B2時，B2應該要有棋子X，並且輪到玩家O，而且玩家都放過棋子了', () => {
      game.placePiece('X', 'B2');
      expect(game.board.squareAt(position`B2`).piece?.symbol).toBe('X');
      expect(game.activePlayer.pieceSymbol).toBe('O');
      expect(game.allPlayersHavePlaced).toBe(true);
    });

    test('當玩家X下子在C3時，會因為已經有棋子而出錯', () => {
      expect(() => game.placePiece('X', 'C3')).toThrow();
    });
  });

  describe('假設玩家O放C3，玩家X放D3', () => {
    beforeEach(() => {
      game.placePiece('O', 'C3');
      game.placePiece('X', 'D3');
    });

    test('當玩家O下子在D2時，D2應該要有棋子O', () => {
      game.placePiece('O', 'D2');
      expect(game.board.squareAt(position`C3`).piece?.symbol).toBe('O');
    });

    test('當玩家X下子在D2時，會因為不是玩家X的回合而出錯', () => {
      expect(() => game.placePiece('X', 'D2')).toThrow();
    });

    test('當玩家O下子在D1時，會因為附近沒有符號，無法聯繫而出錯', () => {
      expect(() => game.placePiece('O', 'D1')).toThrow();
    });
  });

  describe('假設玩家O放C3，玩家X放D3，玩家O放D2', () => {
    beforeEach(() => {
      game.placePiece('O', 'C3');
      game.placePiece('X', 'D3');
      game.placePiece('O', 'D2');
    });

    test('當玩家X下子在C2時，C2應該要有棋子X', () => {
      game.placePiece('X', 'C2');
      expect(game.board.squareAt(position`C2`).piece?.symbol).toBe('X');
    });

    test('當玩家X下子在D2時，會因為已經有棋子而出錯', () => {
      expect(() => game.placePiece('X', 'D2')).toThrow();
    });

    test('當玩家X下子在C1時，會因為附近沒有符號，無法聯繫而出錯', () => {
      expect(() => game.placePiece('X', 'C1')).toThrow();
    });
  });
});

describe('2 名玩家在 5x5 棋盤上的殘局', () => {
  describe('假設玩家X一開始放在左上角，被玩家O壓制，幾步後呈現兩條，輪到玩家X，且剩一步', () => {
    beforeEach(() => {
      const positions = ['B1', 'A1', 'B2', 'A2', 'B3', 'A3', 'B4', 'A4', 'B5'];
      positions.forEach((position) => game.placePiece(game.activePlayer.pieceSymbol, position));
    });

    test('當玩家X下子在A5時，遊戲還不會結束，也還沒有贏家，因為還有玩家能下子', () => {
      game.placePiece('X', 'A5');
      expect(game.ended).toBe(false);
      expect(game.winner).toBeNull();
    });
  });

  describe('假設玩家X一開始放在左上角，被玩家O壓制，幾步後呈現兩條，玩家X已下完最後一步', () => {
    beforeEach(() => {
      const positions = ['B1', 'A1', 'B2', 'A2', 'B3', 'A3', 'B4', 'A4', 'B5', 'A5'];
      positions.forEach((position) => game.placePiece(game.activePlayer.pieceSymbol, position));
    });

    test('當玩家O下子在C1時，遊戲結束，贏家會是玩家O，因為只剩自己能下子了', () => {
      game.placePiece('O', 'C1');
      expect(game.ended).toBe(true);
      expect(game.winner?.pieceSymbol).toBe('O');
    });
  });

  describe('假設玩家交錯的下子，欲將盤面呈現類似西洋棋盤的樣式，輪到玩家O，且剩一步', () => {
    beforeEach(() => {
      const positions = ['A1', 'B1', 'B2', 'A2', 'A3', 'B3', 'B4', 'A4', 'A5', 'B5'];
      positions.push(
        ...Array(5)
          .fill('C?')
          .map((_position, index) => 'C' + (5 - index))
      );
      positions.push(
        ...Array(5)
          .fill('D?')
          .map((_position, index) => 'D' + (index + 1))
      );
      positions.push(
        ...Array(4)
          .fill('E?')
          .map((_position, index) => 'E' + (5 - index))
      );
      positions.forEach((position) => game.placePiece(game.activePlayer.pieceSymbol, position));
    });

    test('當玩家O下子在E1時，遊戲結束，沒有贏家', () => {
      game.placePiece('O', 'E1');
      expect(game.ended).toBe(true);
      expect(game.winner).toBeNull();
    });
  });
});