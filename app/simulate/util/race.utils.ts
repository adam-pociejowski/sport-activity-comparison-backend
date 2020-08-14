import { RaceRider } from "../../core/model/race.rider.model";
import { Rider } from "../../core/model/rider.model";
import { RiderAbilities } from "../../core/model/rider.abilities.model";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { NpcRiderEvent } from "../model/npc.rider.event.model";
import { Stage } from "../../core/model/stage.model";

export class RaceUtils {
    private static BASE_VELOCITY: number = 60.0;

    public static calculateTimeInSeconds = (movedDistance: number,
                                            velocity: number) =>
        ((movedDistance / 1000.0) / velocity) * 3600.0;

    public static randomDouble = (min: number, max: number) =>
        (max - min) * Math.random() + min;

    public static calculateRiderCondition = (baseCondition: number,
                                             maxChange: number,
                                             conditionVariability: number) => {
        let newCondition = baseCondition + RaceUtils.randomDouble(-maxChange, maxChange);
        if (newCondition > 1.0)
            return 1.0;
        else if (newCondition < 1.0 - conditionVariability)
            return 1.0 - conditionVariability;
        return newCondition;
    }

    public static calculateBaseVelocity = (config: RaceConfiguration,
                                           rider: RaceRider,
                                           event: NpcRiderEvent | null,
                                           stage: Stage) => {
        let power = RaceUtils
            .applyScatterFactor(
                RaceUtils
                    .randomRiderFactorsProduct(
                        config,
                        rider,
                        event !== null ?
                            event.currentCondition :
                            1.0),
                config.resultsScattering);
        return {
            velocity: RaceUtils.BASE_VELOCITY *
                config.difficulty *
                RaceUtils.applyScatterFactor(
                    RaceUtils.calculateRiderAbilityFactor(rider.rider, stage),
                    config.resultsScattering) *
                power,
            power: power
        };
    }

    private static applyScatterFactor = (factor: number,
                                         scatterFactor: number) => {
        let result = factor < 1.0 ?
            1.0 - (1.0 - factor) * scatterFactor :
            1.0 + (factor - 1.0) * scatterFactor;
        return result > 0.5 ? result : 0.5;
    }

    private static randomRiderFactorsProduct = (config: RaceConfiguration,
                                                raceRider: RaceRider,
                                                currentRiderCondition: number) =>
        raceRider.raceCondition *
        RaceUtils.randomDouble(1.0 - config.randomFactorVariability, 1.0) *
        currentRiderCondition;

    private static calculateRiderAbilityFactor = (rider: Rider, stage: Stage) =>
        RaceUtils.getAbilityFactor(rider.abilities, stage.abilitiesFactor) / 75.0;

    private static getAbilityFactor = (abilities: RiderAbilities, factors: RiderAbilities) =>
            (abilities.flat * factors.flat +
            abilities.mountain * factors.mountain +
            abilities.hill * factors.hill +
            abilities.timeTrial * factors.timeTrial) / 4;
}