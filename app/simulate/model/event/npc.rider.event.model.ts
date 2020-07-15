export class NpcRiderEvent {
    constructor(public riderId: string,
                public position: number,
                public time: number,
                public velocity: number,
                public currentCondition: number) {}
}