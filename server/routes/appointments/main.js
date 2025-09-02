const controller = require("./controller");
const schema = require("./schema");
const { access } = require("../../middleware/auth");
const { validate } = require("../../middleware/validate");

module.exports = (app) => {
  app.post("/api/appointments", access("appointment.create"), validate(schema.postAppointments), controller.postAppointments);
  app.get("/api/appointments", access("appointment.list"), validate(schema.getAppointmentsQuery), controller.getAppointments);
  app.patch("/api/appointments/:id", access("appointment.update"), validate([schema.idParam, schema.patchAppointments]), controller.patchAppointment);
  app.delete("/api/appointments/:id", access("appointment.delete"), validate(schema.idParam), controller.deleteAppointment);
};
