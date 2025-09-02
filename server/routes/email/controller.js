const { sendEmail } = require("../../functions/email");

module.exports = {
  async postEmailSend(req, res, next) {
    try {
      const { to, subject, text, html } = req.body || {};
      const info = await sendEmail({ to, subject, text, html });
      return res.json({ ok: true, info });
    } catch (err) {
      return next(err);
    }
  },
};
