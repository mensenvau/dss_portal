const { query } = require("../../functions/mysql");

module.exports = {
  async getPayroll(req, res, next) {
    try {
      const { employee_id } = req.params;
      const { from, to } = req.query; // ISO dates
      // Allow employees to view only their own payroll; admins can view any
      if (req.user?.role !== "admin" && Number(employee_id) !== Number(req.user?.id)) {
        return res.status(403).json({ ok: false, error: "Forbidden" });
      }
      const rows = await query(`SELECT SUM(hours) as hours, SUM(hours * rate) as amount FROM time_entries WHERE employee_id = ? AND work_date BETWEEN ? AND ?`, [employee_id, from, to]);
      const [row] = rows || [{}];
      return res.json({ ok: true, data: { hours: row?.hours || 0, amount: row?.amount || 0 } });
    } catch (err) {
      return next(err);
    }
  },
};
