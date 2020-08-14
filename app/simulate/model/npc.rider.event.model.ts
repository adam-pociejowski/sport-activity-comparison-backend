export class NpcRiderEvent {
    constructor(public riderId: string,
                public time: number,
                public velocity: number,
                public power: number,
                public currentCondition: number) {}
}