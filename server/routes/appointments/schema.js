module.exports = {
  postAppointments: {
    current_day: { in: ["body"], isISO8601: true },
    slot_time: { in: ["body"], isString: true, notEmpty: true, trim: true },
    recruiter_name: { in: ["body"], optional: true, isString: true, trim: true },
    role: { in: ["body"], optional: true, isString: true, trim: true },
    client: { in: ["body"], optional: true, isString: true, trim: true },
    round: { in: ["body"], optional: true, isInt: { options: { min: 1, max: 7 } }, toInt: true },
    confirmed: { in: ["body"], optional: true, isBoolean: true, toBoolean: true },
    short_code: { in: ["body"], optional: true, isIn: { options: [["FTE (W2)", "W2-C", "CTH", "1099", "C2C"]] } },
    type: { in: ["body"], optional: true, isIn: { options: [["Hybrid", "Remote", "Full OnSite"]] } },
    notes: { in: ["body"], optional: true, isString: true, trim: true },
  },
  getAppointmentsQuery: {
    start: { in: ["query"], optional: true, isISO8601: true },
    end: {
      in: ["query"],
      optional: true,
      isISO8601: true,
      custom: {
        options: (value, { req }) => {
          if (value && req.query && req.query.start) {
            return new Date(value) > new Date(req.query.start);
          }
          return true;
        },
      },
    },
  },
  patchAppointments: {
    current_day: { in: ["body"], optional: true, isISO8601: true },
    slot_time: { in: ["body"], optional: true, isString: true, trim: true },
    recruiter_name: { in: ["body"], optional: true, isString: true, trim: true },
    role: { in: ["body"], optional: true, isString: true, trim: true },
    client: { in: ["body"], optional: true, isString: true, trim: true },
    round: { in: ["body"], optional: true, isInt: { options: { min: 1, max: 7 } }, toInt: true },
    confirmed: { in: ["body"], optional: true, isBoolean: true, toBoolean: true },
    short_code: { in: ["body"], optional: true, isIn: { options: [["FTE (W2)", "W2-C", "CTH", "1099", "C2C"]] } },
    type: { in: ["body"], optional: true, isIn: { options: [["Hybrid", "Remote", "Full OnSite"]] } },
    notes: { in: ["body"], optional: true, isString: true, trim: true },
  },
  idParam: {
    id: { in: ["params"], isInt: true, toInt: true },
  },
};
