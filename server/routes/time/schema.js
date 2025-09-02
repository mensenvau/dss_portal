module.exports = {
  postTime: {
    employee_id: { in: ['body'], isInt: true, toInt: true },
    role: { in: ['body'], isString: true, notEmpty: true, trim: true },
    hours: { in: ['body'], isFloat: { options: { min: 0 } }, toFloat: true },
    points: { in: ['body'], isInt: true, toInt: true },
    comment: { in: ['body'], optional: true, isString: true },
    work_date: { in: ['body'], isISO8601: true },
  },
  rangeQuery: {
    from: { in: ['query'], isISO8601: true },
    to: { in: ['query'], isISO8601: true },
  },
};

