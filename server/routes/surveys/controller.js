const { query } = require("../../functions/mysql");

module.exports = {
  async postSurveys(req, res, next) {
    try {
      const { title, schema_json } = req.body || {};
      const ins = await query("INSERT INTO survey_forms (title, schema_json) VALUES (?, ?)", [title, JSON.stringify(schema_json || {})]);
      return res.json({ ok: true, id: ins.insertId });
    } catch (err) {
      return next(err);
    }
  },
  async getSurveys(req, res, next) {
    try {
      const rows = await query("SELECT id, title, created_at FROM survey_forms ORDER BY id DESC");
      return res.json({ ok: true, data: rows });
    } catch (err) {
      return next(err);
    }
  },
  async getSurvey(req, res, next) {
    try {
      const { id } = req.params;
      const [row] = await query("SELECT id, title, schema_json FROM survey_forms WHERE id = ?", [id]);
      return res.json({ ok: true, data: row });
    } catch (err) {
      return next(err);
    }
  },
  async postSurveySubmit(req, res, next) {
    try {
      const { id } = req.params; // form id
      const { user_id, answers } = req.body || {};
      const ins = await query("INSERT INTO survey_responses (form_id, user_id, answers_json) VALUES (?, ?, ?)", [id, user_id, JSON.stringify(answers || {})]);
      return res.json({ ok: true, id: ins.insertId });
    } catch (err) {
      return next(err);
    }
  },
};
