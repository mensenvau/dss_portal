const { query } = require("./mysql");

async function ensurePolicy(policyKey, description = null) {
  await query("INSERT INTO access_policies (policy_key, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)", [policyKey, description]);
  const [row] = await query("SELECT id, policy_key, description FROM access_policies WHERE policy_key = ?", [policyKey]);
  return row;
}

async function getAllowedRoles(policyKey) {
  const rows = await query(
    `SELECT r.name AS role FROM access_policies p
     JOIN access_policy_roles pr ON pr.policy_id = p.id
     JOIN roles r ON r.id = pr.role_id
     WHERE p.policy_key = ?`,
    [policyKey]
  );
  return rows.map((r) => r.role);
}

async function grantRole(policyKey, roleName) {
  const [policy] = await query("SELECT id FROM access_policies WHERE policy_key = ?", [policyKey]);
  if (!policy) throw new Error("Policy not found");
  const [role] = await query("SELECT id FROM roles WHERE name = ?", [roleName]);
  if (!role) throw new Error("Role not found");
  await query("INSERT INTO access_policy_roles (policy_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = role_id", [policy.id, role.id]);
}

async function revokeRole(policyKey, roleName) {
  const [policy] = await query("SELECT id FROM access_policies WHERE policy_key = ?", [policyKey]);
  if (!policy) return;
  const [role] = await query("SELECT id FROM roles WHERE name = ?", [roleName]);
  if (!role) return;
  await query("DELETE FROM access_policy_roles WHERE policy_id = ? AND role_id = ?", [policy.id, role.id]);
}

async function listPolicies() {
  const policies = await query("SELECT id, policy_key, description FROM access_policies ORDER BY policy_key");
  const map = new Map();
  for (const p of policies) map.set(p.id, { ...p, roles: [] });
  const roles = await query(`SELECT pr.policy_id, r.name AS role FROM access_policy_roles pr JOIN roles r ON r.id = pr.role_id`);
  for (const r of roles) {
    if (map.has(r.policy_id)) map.get(r.policy_id).roles.push(r.role);
  }
  return Array.from(map.values());
}

module.exports = { ensurePolicy, getAllowedRoles, grantRole, revokeRole, listPolicies };
