const controller = require("./controller");
const { validate } = require("../../middleware/validate");
const { access } = require("../../middleware/auth");
const schema = require("./schema");

module.exports = (app) => {
  app.post("/api/auth/register", access("auth.register"), validate(schema.postAuthRegister), controller.postAuthRegister);
  app.post("/api/auth/login", access("auth.login"), validate(schema.postAuthLogin), controller.postAuthLogin);
  app.get("/api/auth/me", access("auth.me"), controller.getAuthMe);
};
