import { RaceMode } from "../model/config/race.mode";
import { SimulateRaceService } from "./simulate.race.service";
import { SimulateRacePlayerWithNpcService } from "./simulate.race.player.with.npc.service";

export class SimulateRaceStrategyFactory {
    public static INSTANCE = new SimulateRaceStrategyFactory();
    private static strategyMap = new Map<RaceMode, SimulateRaceService>();
    private constructor() {
        SimulateRaceStrategyFactory
            .strategyMap
            .set(
                SimulateRacePlayerWithNpcService.INSTANCE.getRaceMode(),
                SimulateRacePlayerWithNpcService.INSTANCE);
    }

    public static fromRaceMode = (mode: RaceMode) => {
        let strategy = SimulateRaceStrategyFactory.strategyMap.get(mode);
        if (strategy === undefined || strategy === null) {
            throw new Error(`Strategy not found for race mode: ${mode}`);
        }
        return strategy;
    }
}