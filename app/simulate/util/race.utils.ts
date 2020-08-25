import { RaceRider } from "../../core/model/race.rider.model";
import { Rider } from "../../core/model/rider.model";
import { RiderAbilities } from "../../core/model/rider.abilities.model";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { NpcRiderEvent } from "../model/npc.rider.event.model";
import { Stage } from "../../core/model/stage.model";
import {RaceEventService} from "../../core/service/race.event.service";

export class RaceUtils {
    private static BASE_VELOCITY: number = 60.0;
    private static MAX_RIDER_ABILITY_AMOUNT: number = 82.0;

    public static getLastEvent = async (raceId: string, stageId: string) => {
        let events = await RaceEventService.INSTANCE.findPreviousEvents(1, raceId, stageId);
        return events.length == 0 ? null : events[events.length - 1];
    }

    public static findStage = (config: RaceConfiguration,
                               stageId: string) =>
        config
            .stages
            .find((stage: Stage) => stage.stageId === stageId)!;

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
            .applyScatter(
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
                RaceUtils.calcRiderAbilityFactor(rider.rider, stage) *
                power,
            power: power
        };
    }

    private static applyScatter = (factor: number,
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

    private static calcRiderAbilityFactor = (rider: Rider, stage: Stage) => {
        let factorsSum = RaceUtils.sumAbilityFactors(stage.abilitiesFactor);
        let baseAbilityFactor = RaceUtils.calcAbilityFactorProduct(rider.abilities, stage.abilitiesFactor) /
            factorsSum /
            RaceUtils.MAX_RIDER_ABILITY_AMOUNT;
        return RaceUtils.applyScatter(baseAbilityFactor, factorsSum);
    }

    private static calcAbilityFactorProduct = (abilities: RiderAbilities, factors: RiderAbilities) =>
            (abilities.flat * factors.flat +
            abilities.mountain * factors.mountain +
            abilities.hill * factors.hill +
            abilities.timeTrial * factors.timeTrial);

    private static sumAbilityFactors = (factors: RiderAbilities) =>
        factors.flat + factors.mountain + factors.hill + factors.timeTrial;
}