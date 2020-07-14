export abstract class SimulateRaceService<E, T> {
    protected constructor() {}

    public abstract execute(param: E): Promise<T>;
}