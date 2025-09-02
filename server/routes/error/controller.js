const { logger } = require("../../functions/logger");
const { validationResult } = require("express-validator");

exports.nextError = (err, req, res, next) => {
  logger.error(`nextError: ${err.message}`);
  res.status(400).json({ message: err?.message || "Noma'lum xatolik yuz berdi" });
};

exports.nextMissed = (req, res, next) => {
  logger.error("Sahifa topilmadi");
  res.status(404).json({ message: "Sahifa topilmadi" });
};

exports.nextValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Tasdiqlash xatosi", details: errors.array() });
  }
  next();
};
