const { query } = require("../../functions/mysql");
const { assignRole, removeRole } = require("../../functions/roles");

module.exports = {
  async getEmployees(req, res, next) {
    try {
      const rows = await query("SELECT id, full_name, email FROM employees");
      return res.json({ ok: true, data: rows });
    } catch (err) {
      return next(err);
    }
  },
  async postEmployees(req, res, next) {
    try {
      const { full_name, email, role } = req.body || {};
      const ins = await query("INSERT INTO employees (full_name, email) VALUES (?, ?, ?)", [full_name, email]);
      return res.json({ ok: true, id: ins.insertId });
    } catch (err) {
      return next(err);
    }
  },
  async getEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const [row] = await query("SELECT id, full_name, email FROM employees WHERE id = ?", [id]);
      return res.json({ ok: true, data: row });
    } catch (err) {
      return next(err);
    }
  },
  async patchEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { full_name, email, role } = req.body || {};
      await query("UPDATE employees SET full_name = ?, email = ? WHERE id = ?", [full_name, email, role, id]);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;
      await query("DELETE FROM employees WHERE id = ?", [id]);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async postEmployeeClientAssign(req, res, next) {
    try {
      const { id, client_id } = req.params;
      await query("INSERT INTO employee_clients (employee_id, client_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE client_id = client_id", [id, client_id]);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async postEmployeeRoleAssign(req, res, next) {
    try {
      const { id, role } = req.params;
      await assignRole(id, role);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async deleteEmployeeRoleUnassign(req, res, next) {
    try {
      const { id, role } = req.params;
      await removeRole(id, role);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
};
