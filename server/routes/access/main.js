const controller = require("./controller");
const { access } = require("../../middleware/auth");

module.exports = (app) => {
  app.get("/api/access/policies", access("access.manage"), controller.getAccessPolicies);
  app.post("/api/access/policies", access("access.manage"), controller.postAccessPolicyUpsert);
  app.delete("/api/access/policies/:key", access("access.manage"), controller.deleteAccessPolicy);
  app.post("/api/access/policies/:key/roles/:role", access("access.manage"), controller.postAccessPolicyRoleGrant);
  app.delete("/api/access/policies/:key/roles/:role", access("access.manage"), controller.deleteAccessPolicyRoleRevoke);
};
