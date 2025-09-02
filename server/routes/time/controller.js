const { query } = require("../../functions/mysql");

module.exports = {
  async postTime(req, res, next) {
    try {
      const { employee_id, role, hours, points, comment, work_date } = req.body || {};
      const ins = await query("INSERT INTO time_entries (employee_id, role, hours, points, comment, work_date) VALUES (?, ?, ?, ?, ?, ?)", [employee_id, role, hours, points, comment, work_date]);
      return res.json({ ok: true, id: ins.insertId });
    } catch (err) {
      return next(err);
    }
  },
  async getTime(req, res, next) {
    try {
      const rows = await query("SELECT * FROM time_entries ORDER BY work_date DESC, id DESC");
      return res.json({ ok: true, data: rows });
    } catch (err) {
      return next(err);
    }
  },
  async getTimeScoreboard(req, res, next) {
    try {
      const { from, to } = req.query;
      const rows = await query(
        `SELECT employee_id, SUM(hours) as hours, SUM(points) as points
         FROM time_entries WHERE work_date BETWEEN ? AND ?
         GROUP BY employee_id ORDER BY points DESC, hours DESC`,
        [from, to]
      );
      return res.json({ ok: true, data: rows });
    } catch (err) {
      return next(err);
    }
  },
};
