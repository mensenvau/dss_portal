module.exports = {
  idParam: {
    employee_id: { in: ['params'], isInt: true, toInt: true },
    from: { in: ['query'], optional: true, isISO8601: true },
    to: { in: ['query'], optional: true, isISO8601: true },
  },
};

