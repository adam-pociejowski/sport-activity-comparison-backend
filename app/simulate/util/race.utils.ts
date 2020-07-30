import { RaceRider } from "../model/config/race.rider.model";
import { Rider } from "../model/config/rider.model";
import { RiderAbilities } from "../model/config/rider.abilities.model";

export class RaceUtils {
    private static BASE_VELOCITY: number = 60.0;

    public static calculateTimeInSeconds = (movedDistance: number,
                                            velocity: number) =>
        ((movedDistance / 1000.0) / velocity) * 3600.0;

    public static calculateBaseVelocity = (difficulty: number,
                                           raceRider: RaceRider) =>
        RaceUtils.BASE_VELOCITY *
        difficulty *
        raceRider.raceCondition *
        RaceUtils.calculateRiderAbilityFactor(raceRider.rider) *
        ((Math.random() + 10.0) / 11.0);

    private static calculateRiderAbilityFactor = (rider: Rider) =>
        RaceUtils.getAverageAbilityLevel(rider.abilities) / 75.0;

    private static getAverageAbilityLevel = (abilities: RiderAbilities) =>
        (abilities.flat  + abilities.mountain + abilities.hill + abilities.timeTrial) / 4;
}