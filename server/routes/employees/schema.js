module.exports = {
  postEmployees: {
    full_name: { in: ["body"], isString: true, notEmpty: true, trim: true },
    email: { in: ["body"], isEmail: true, normalizeEmail: true },
    role: { in: ["body"], optional: true, isString: true, trim: true },
  },
  patchEmployee: {
    id: { in: ["params"], isInt: true, toInt: true },
    full_name: { in: ["body"], optional: true, isString: true, trim: true },
    email: { in: ["body"], optional: true, isEmail: true, normalizeEmail: true },
    role: { in: ["body"], optional: true, isString: true, trim: true },
  },
  idParam: {
    id: { in: ["params"], isInt: true, toInt: true },
  },
  assignClient: {
    id: { in: ["params"], isInt: true, toInt: true },
    client_id: { in: ["params"], isInt: true, toInt: true },
  },
  roleParam: {
    id: { in: ["params"], isInt: true, toInt: true },
    role: { in: ["params"], isString: true, trim: true },
  },
};
