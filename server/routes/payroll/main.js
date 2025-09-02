const payroll_controller = require("./controller");
const { access } = require("../../middleware/auth");
const { validate } = require("../../middleware/validate");
const schema = require("./schema");

module.exports = (app) => {
  app.get("/api/payroll/:employee_id", access("payroll.view"), validate(schema.idParam), payroll_controller.getPayroll);
};
