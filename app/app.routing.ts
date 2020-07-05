import { ActivityRestController } from "./activity/controller/activity.rest.controller";

module.exports = function(app: any) {
    app.use('/rest/activity', new ActivityRestController().router);
};
