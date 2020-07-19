export class InitRaceRequest {
    constructor(public difficulty: number,
                public stagesDistance: number[],
                public ridersAmount: number,
                public showMyResults: boolean) {}
}