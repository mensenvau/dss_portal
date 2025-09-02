const { checkSchema, validationResult } = require("express-validator");

function validate(schema) {
  const chain = Array.isArray(schema) ? schema : [schema];
  const middlewares = chain.map((s) => checkSchema(s));
  middlewares.push((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, errors: errors.array() });
    }
    return next();
  });
  return middlewares;
}

module.exports = { validate };
