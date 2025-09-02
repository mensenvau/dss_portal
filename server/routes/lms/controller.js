const { query } = require("../../functions/mysql");

module.exports = {
  async getLmsCourses(req, res, next) {
    try {
      const rows = await query("SELECT id, title, summary FROM courses ORDER BY id DESC");
      res.json({ ok: true, data: rows });
    } catch (e) {
      next(e);
    }
  },

  async postLmsCourse(req, res, next) {
    try {
      const { title, summary } = req.body || {};
      const rows = await query("INSERT INTO courses (title, summary) VALUES (?, ?)", [title, summary]);
      res.json({ ok: true, id: rows.insertId });
    } catch (e) {
      next(e);
    }
  },

  async getLmsCourse(req, res, next) {
    try {
      const { id } = req.params;
      const [course] = await query("SELECT id, title, summary FROM courses WHERE id = ?", [id]);
      const lessons = await query("SELECT id, title FROM lessons WHERE course_id = ?", [id]);
      res.json({ ok: true, data: { course, lessons } });
    } catch (e) {
      next(e);
    }
  },

  async postLmsCourseLesson(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content } = req.body || {};
      const result = await query("INSERT INTO lessons (course_id, title, content) VALUES (?, ?, ?)", [id, title, content]);
      res.json({ ok: true, id: result.insertId });
    } catch (e) {
      next(e);
    }
  },

  async postLmsEnroll(req, res, next) {
    try {
      const { user_id, course_id } = req.body || {};
      await query("INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)", [user_id, course_id]);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
};
