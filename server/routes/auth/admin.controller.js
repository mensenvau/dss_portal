const { query } = require("../../functions/mysql");
const { getRolesForEmployee, assignRole, removeRole } = require("../../functions/roles");

module.exports = {
  async getUsers(req, res, next) {
    try {
      const users = await query("SELECT id, full_name, email FROM employees ORDER BY id DESC");
      const role_rows = await query(`SELECT er.employee_id, r.name AS role FROM employee_roles er JOIN roles r ON r.id = er.role_id`);
      const role_map = new Map();
      for (const rr of role_rows) {
        if (!role_map.has(rr.employee_id)) role_map.set(rr.employee_id, []);
        role_map.get(rr.employee_id).push(rr.role);
      }
      const data = users.map((u) => ({ ...u, roles: Array.from(new Set([u.role, ...(role_map.get(u.id) || [])].filter(Boolean))) }));
      return res.json({ ok: true, data });
    } catch (err) {
      return next(err);
    }
  },
  async postUserRoleAssign(req, res, next) {
    try {
      const { id, role } = req.params;
      await assignRole(id, role);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async deleteUserRoleUnassign(req, res, next) {
    try {
      const { id, role } = req.params;
      await removeRole(id, role);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
};
