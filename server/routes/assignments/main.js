const controller = require("./controller");
const { access } = require("../../middleware/auth");

module.exports = (app) => {
  app.post("/api/assignments", access("assignment.create"), controller.postAssignmentsAssign);
  app.get("/api/assignments", access("assignment.list"), controller.getAssignments);
};
