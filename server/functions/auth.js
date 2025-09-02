const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function signAccessToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role, roles: user.roles || [], name: user.full_name };
  const token = jwt.sign(payload, process.env.APP_JWT_ACCESS_SECRET, { expiresIn: "12h" });
  return token;
}

module.exports = { hashPassword, comparePassword, signAccessToken };
