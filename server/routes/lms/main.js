const controller = require("./controller");
const { access } = require("../../middleware/auth");
const { validate } = require("../../middleware/validate");
const schema = require("./schema");

module.exports = (app) => {
  app.get("/api/lms/courses", access("lms.course.read"), controller.getLmsCourses);
  app.post("/api/lms/courses", access("lms.course.write"), validate(schema.postLmsCourse), controller.postLmsCourse);
  app.get("/api/lms/courses/:id", access("lms.course.read"), validate(schema.idParam), controller.getLmsCourse);
  app.post("/api/lms/courses/:id/lessons", access("lms.course.lesson.write"), validate(schema.postLmsCourseLesson), controller.postLmsCourseLesson);
  app.post("/api/lms/enroll", access("lms.enrollment.create"), validate(schema.postLmsEnroll), controller.postLmsEnroll);
};
