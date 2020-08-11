export class LocationData {
    constructor(public latitude: number,
                public longitude: number,
                public accuracy: number,
                public altitude: number = 0) {}
}