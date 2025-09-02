const controller = require("./controller");
const { access } = require("../../middleware/auth");
const { validate } = require("../../middleware/validate");
const schema = require("./schema");

module.exports = (app) => {
  app.post("/api/time", access("time.entry.create"), validate(schema.postTime), controller.postTime);
  app.get("/api/time", access("time.entry.list"), controller.getTime);
  app.get("/api/time/scoreboard", access("time.scoreboard.view"), validate(schema.rangeQuery), controller.getTimeScoreboard);
};
