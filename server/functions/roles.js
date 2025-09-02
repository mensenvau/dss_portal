const { query } = require("./mysql");

async function ensureRole(name) {
  await query("INSERT INTO roles (name) VALUES (?) ON DUPLICATE KEY UPDATE name = VALUES(name)", [name]);
  const [row] = await query("SELECT id, name FROM roles WHERE name = ?", [name]);
  return row;
}

async function assignRole(employee_id, role_name) {
  const role = await ensureRole(role_name);
  await query("INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = role_id", [employee_id, role.id]);
}

async function removeRole(employee_id, role_name) {
  const [role] = await query("SELECT id FROM roles WHERE name = ?", [role_name]);
  if (!role) return;
  await query("DELETE FROM employee_roles WHERE employee_id = ? AND role_id = ?", [employee_id, role.id]);
}

async function getRolesForEmployee(employee_id) {
  const rows = await query(`SELECT r.name FROM employee_roles er JOIN roles r ON r.id = er.role_id WHERE er.employee_id = ? ORDER BY r.name`, [employee_id]);
  return rows.map((r) => r.name);
}

module.exports = { ensureRole, assignRole, removeRole, getRolesForEmployee };
