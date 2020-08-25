import { RankingRestController } from "./ranking/controller/ranking.rest.controller";
import { SimulateRaceController } from "./simulate/controller/simulate.race.controller";

module.exports = function(app: any) {
    app.use('/rest/ranking', new RankingRestController().router);
    app.use('/rest/race', new SimulateRaceController().router);
};
