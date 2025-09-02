const { query } = require("../../functions/mysql");

module.exports = {
  async postAssignmentsAssign(req, res, next) {
    try {
      const { employee_id, client_id } = req.body || {};
      await query("INSERT INTO employee_clients (employee_id, client_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE client_id = client_id", [employee_id, client_id]);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async getAssignments(req, res, next) {
    try {
      const rows = await query(
        `SELECT ec.employee_id, e.full_name, ec.client_id, c.name AS client_name FROM employee_clients ec
         JOIN employees e ON e.id = ec.employee_id
         JOIN clients c ON c.id = ec.client_id`
      );
      return res.json({ ok: true, data: rows });
    } catch (err) {
      return next(err);
    }
  },
};
