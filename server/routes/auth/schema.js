module.exports = {
  postAuthRegister: {
    full_name: { in: ["body"], isString: true, notEmpty: true, trim: true },
    email: { in: ["body"], isEmail: true, normalizeEmail: true },
    password: { in: ["body"], isString: true, isLength: { options: { min: 6 } } },
  },
  postAuthLogin: {
    email: { in: ["body"], isEmail: true, normalizeEmail: true },
    password: { in: ["body"], isString: true, notEmpty: true },
  },
};
