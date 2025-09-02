const controller = require("./controller");
const { access } = require("../../middleware/auth");
const { validate } = require("../../middleware/validate");
const schema = require("./schema");

module.exports = (app) => {
  app.post("/api/surveys", access("survey.form.create"), validate(schema.postSurveys), controller.postSurveys);
  app.get("/api/surveys", access("survey.form.read"), controller.getSurveys);
  app.get("/api/surveys/:id", access("survey.form.read"), validate(schema.idParam), controller.getSurvey);
  app.post("/api/surveys/:id/submit", access("survey.response.submit"), validate(schema.postSurveySubmit), controller.postSurveySubmit);
};
