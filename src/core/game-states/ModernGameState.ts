import Board from '../Board';
import { Coordinate } from '../types';
import ClassicGameState from './ClassicGameState';

class ModernGameState extends ClassicGameState {
  public rootCoordinates: readonly Coordinate[];

  constructor(state: Partial<ModernGameState>) {
    state.numberOfPlayers ||= 2;
    state.board ||= new Board({ width: state.numberOfPlayers * 4 + 1 });
    super(state);
    this.rootCoordinates = state.rootCoordinates || [];
  }
}

export default ModernGameState;
