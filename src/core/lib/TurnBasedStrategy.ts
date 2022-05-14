namespace TurnBasedStrategy {
  export abstract class FlowStep<TState extends {} = {}, TMove = any> {
    public abstract readonly name: string;

    public prepare?(state: TState): void;

    public takeMove(move: TMove, state: TState): void {
      this.judgeMove(move, state);
      this.executeMove(move, state);
      this.prepareForNext(state);
    }

    protected abstract judgeMove(move: TMove, state: Readonly<TState>): void;

    protected abstract executeMove(move: TMove, state: TState): void;

    protected abstract prepareForNext(state: TState): void;
  }
}

export default TurnBasedStrategy;
