const controller = require("./controller");
const { access } = require("../../middleware/auth");

module.exports = (app) => {
  app.post("/api/email/send", access("email.send"), controller.postEmailSend);
};
