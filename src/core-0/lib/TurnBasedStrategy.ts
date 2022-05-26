namespace TurnBasedStrategy {
  export abstract class FlowStep<TState extends {} = {}, TMove = any> {
    public abstract readonly name: string;

    public prepare?(state: TState): Promise<void>;

    public async takeMove(move: TMove, state: TState): Promise<void> {
      await this.judgeMove(move, state);
      await this.executeMove(move, state);
      await this.prepareForNext(state);
    }

    protected abstract judgeMove(move: TMove, state: Readonly<TState>): void | Promise<void>;

    protected abstract executeMove(move: TMove, state: TState): void | Promise<void>;

    protected abstract prepareForNext(state: TState): void | Promise<void>;
  }
}

export default TurnBasedStrategy;
