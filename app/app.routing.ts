import { ActivityRestController } from "./ranking/controller/activity.rest.controller";
import {SimulateRaceController} from "./simulate/controller/simulate.race.controller";

module.exports = function(app: any) {
    app.use('/rest/activity', new ActivityRestController().router);
    app.use('/rest/race', new SimulateRaceController().router);
};
