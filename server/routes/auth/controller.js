const { query } = require("../../functions/mysql");
const { hashPassword, comparePassword, signAccessToken } = require("../../functions/auth");
const { assignRole, getRolesForEmployee } = require("../../functions/roles");

module.exports = {
  async postAuthRegister(req, res, next) {
    try {
      const { full_name, email, password } = req.body || {};
      const [exists] = await query("SELECT id FROM employees WHERE email = ?", [email]);
      if (exists) return res.status(409).json({ ok: false, error: "Email already registered" });
      const ins = await query("INSERT INTO employees (full_name, email, password_hash) VALUES (?, ?, ?)", [full_name, email, await hashPassword(password)]);
      await assignRole(ins.insertId, "guest");
      return res.json({ ok: true, id: ins.insertId });
    } catch (err) {
      return next(err);
    }
  },
  async postAuthLogin(req, res, next) {
    try {
      const { email, password } = req.body || {};
      const [user] = await query("SELECT id, full_name, email, password_hash FROM employees WHERE email = ?", [email]);
      if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });
      const ok = await comparePassword(password, user.password_hash || "");
      if (!ok) return res.status(401).json({ ok: false, error: "Invalid credentials" });
      const roles_list = await getRolesForEmployee(user.id);
      user.roles = Array.from(new Set([user.role, ...roles_list].filter(Boolean)));
      const token = signAccessToken(user);
      return res.json({ ok: true, token, user: { id: user.id, email: user.email, role: user.role, roles: user.roles, full_name: user.full_name } });
    } catch (err) {
      return next(err);
    }
  },
  async getAuthMe(req, res, next) {
    try {
      return res.json({ ok: true, user: req.user || null });
    } catch (err) {
      return next(err);
    }
  },
};
