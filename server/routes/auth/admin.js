const controller = require("./admin.controller");
const { access } = require("../../middleware/auth");

module.exports = (app) => {
  app.get("/api/auth/users", access("user.list"), controller.getUsers);
  app.post("/api/auth/users/:id/roles/:role", access("user.role.assign"), controller.postUserRoleAssign);
  app.delete("/api/auth/users/:id/roles/:role", access("user.role.unassign"), controller.deleteUserRoleUnassign);
};
