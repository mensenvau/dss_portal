const controller = require("./controller");
const { access } = require("../../middleware/auth");
const { validate } = require("../../middleware/validate");
const schema = require("./schema");

module.exports = (app) => {
  app.get("/api/employees", access("employee.list"), controller.getEmployees);
  app.post("/api/employees", access("employee.create"), validate(schema.postEmployees), controller.postEmployees);
  app.get("/api/employees/:id", access("employee.get"), validate(schema.idParam), controller.getEmployee);
  app.patch("/api/employees/:id", access("employee.update"), validate(schema.patchEmployee), controller.patchEmployee);
  app.delete("/api/employees/:id", access("employee.delete"), validate(schema.idParam), controller.deleteEmployee);
  app.post("/api/employees/:id/clients/:client_id", access("employee.client.assign"), validate(schema.assignClient), controller.postEmployeeClientAssign);
  app.post("/api/employees/:id/roles/:role", access("employee.role.assign"), validate(schema.roleParam), controller.postEmployeeRoleAssign);
  app.delete("/api/employees/:id/roles/:role", access("employee.role.unassign"), validate(schema.roleParam), controller.deleteEmployeeRoleUnassign);
};
