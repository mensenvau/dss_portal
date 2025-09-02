module.exports = {
  postLmsCourse: {
    title: { in: ['body'], isString: true, notEmpty: true, trim: true },
    summary: { in: ['body'], optional: true, isString: true, trim: true },
  },
  postLmsCourseLesson: {
    id: { in: ['params'], isInt: true, toInt: true },
    title: { in: ['body'], isString: true, notEmpty: true, trim: true },
    content: { in: ['body'], optional: true, isString: true },
  },
  postLmsEnroll: {
    user_id: { in: ['body'], isInt: true, toInt: true },
    course_id: { in: ['body'], isInt: true, toInt: true },
  },
  idParam: {
    id: { in: ['params'], isInt: true, toInt: true },
  },
};

