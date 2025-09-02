const { query } = require("../../functions/mysql");
const { admin } = require("../../middleware/auth");

module.exports = {
  async postAppointments(req, res, next) {
    try {
      const client_id = req.user && req.user.id;
      const { current_day, slot_time, recruiter_name, role, client, round, confirmed, short_code, type, notes } = req.body || {};
      const input = [client_id, current_day, slot_time, recruiter_name, role, client, round, confirmed, short_code, type, notes];
      console.log(input);
      const [{ cnt }] = await query(`SELECT COUNT(*) AS cnt FROM appointments WHERE client_id = ? AND slot_time = ? AND current_day < COALESCE(?, '9999-12-31 23:59:59')`, [client_id, slot_time, current_day]);
      if (cnt > 0) return res.status(409).json({ ok: false, error: "Overlapping appointment exists" });
      const ins = await query("INSERT INTO appointments (client_id, current_day, slot_time, recruiter_name, role, client, round, confirmed, short_code, type, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", input);
      return res.json({ ok: true, id: ins.insertId });
    } catch (err) {
      return next(err);
    }
  },
  async getAppointments(req, res, next) {
    try {
      const client_id = req.user && req.user.id;
      let data = [];
      if (!admin(req.user)) {
        data = await query(`SELECT * FROM appointments ORDER BY current_day, slot_time DESC`, []);
      } else {
        data = await query(`SELECT * FROM appointments WHERE client_id = ? ORDER BY current_day, slot_time DESC`, [client_id]);
      }
      return res.json({ ok: true, data });
    } catch (err) {
      return next(err);
    }
  },
  async patchAppointment(req, res, next) {
    try {
      const client_id = req.user && req.user.id;
      const { current_day, slot_time, recruiter_name, role, client, round, confirmed, short_code, type, notes } = req.body || {};
      const input = [current_day, slot_time, recruiter_name, role, client, round, confirmed, short_code, type, notes, client_id, req.params.id];

      const [{ cnt }] = await query(`SELECT COUNT(*) AS cnt FROM appointments WHERE client_id = ? AND slot_time = ? AND current_day < COALESCE(?, '9999-12-31 23:59:59')`, [client_id, slot_time, current_day]);
      if (cnt > 0) return res.status(409).json({ ok: false, error: "Overlapping appointment exists" });

      const upt = await query("UPDATE appointments current_day = ?, slot_time = ?, recruiter_name = ?, role = ?, client = ?, round = ?, confirmed = ?, short_code = ?, type = ?, notes = ? WHERE client_id = ? and id = ?", input);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async deleteAppointment(req, res, next) {
    try {
      const { id } = req.params;
      if (admin(req.user)) {
        await query("DELETE FROM appointments WHERE id = ?", [id]);
      } else {
        const client_id = req.user && req.user.id;
        const del = await query("DELETE FROM appointments WHERE id = ? AND client_id = ?", [id, client_id]);
        if (del.affectedRows === 0) return res.status(404).json({ ok: false, error: "Not found" });
      }
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
};
