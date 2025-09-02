module.exports = {
  postSurveys: {
    title: { in: ['body'], isString: true, notEmpty: true, trim: true },
    schema_json: { in: ['body'], optional: true },
  },
  idParam: {
    id: { in: ['params'], isInt: true, toInt: true },
  },
  postSurveySubmit: {
    id: { in: ['params'], isInt: true, toInt: true },
    user_id: { in: ['body'], optional: true, isInt: true, toInt: true },
    answers: { in: ['body'], optional: true },
  },
};

