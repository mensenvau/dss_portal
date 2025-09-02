const { listPolicies, ensurePolicy, grantRole, revokeRole } = require("../../functions/access");

module.exports = {
  async getAccessPolicies(req, res, next) {
    try {
      const data = await listPolicies();
      return res.json({ ok: true, data });
    } catch (err) {
      return next(err);
    }
  },
  async postAccessPolicyUpsert(req, res, next) {
    try {
      const { key, description } = req.body || {};
      const p = await ensurePolicy(key, description || null);
      return res.json({ ok: true, data: p });
    } catch (err) {
      return next(err);
    }
  },
  async deleteAccessPolicy(req, res, next) {
    try {
      const { key } = req.params;
      await revokeAll(key);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async postAccessPolicyRoleGrant(req, res, next) {
    try {
      const { key, role } = req.params;
      await grantRole(key, role);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
  async deleteAccessPolicyRoleRevoke(req, res, next) {
    try {
      const { key, role } = req.params;
      await revokeRole(key, role);
      return res.json({ ok: true });
    } catch (err) {
      return next(err);
    }
  },
};

async function revokeAll(policy_key) {
  // naive remove: delete policy and cascade deletes roles via FK
  const { query } = require("../../functions/mysql");
  await query("DELETE FROM access_policies WHERE policy_key = ?", [policy_key]);
}
