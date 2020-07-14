export class InitRaceRequest {
    constructor(public difficulty: number,
                public distance: number,
                public ridersAmount: number,
                public showMyResults: boolean) {}
}