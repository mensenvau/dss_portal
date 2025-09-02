-- Minimal schema for new modules
DROP DATABASE dss_portal ; 
CREATE DATABASE dss_portal;

USE dss_portal;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE,
  password_hash VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles (dynamic) and mapping
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS employee_roles (
  employee_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (employee_id, role_id),
  CONSTRAINT fk_er_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_er_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Seed baseline roles
INSERT INTO roles (name)
  VALUES ('guest'),('student'),('developer'),('employee'),('client'),('manager'),('admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

CREATE TABLE IF NOT EXISTS employee_clients (
  employee_id INT NOT NULL,
  client_id INT NOT NULL,
  PRIMARY KEY (employee_id, client_id),
  CONSTRAINT fk_ec_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_ec_cli FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  current_day DATETIME NOT NULL,
  slot_time VARCHAR(20) NOT NULL,
  recruiter_name VARCHAR(200) NULL,
  role VARCHAR(200) NULL,
  client VARCHAR(200) NULL,
  round VARCHAR(20) NULL,
  confirmed VARCHAR(20) NULL,
  short_code VARCHAR(20) NULL,
  type VARCHAR(20) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_cli FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE KEY uq_client_datetime (current_day, slot_time)
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  summary TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content MEDIUMTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_less_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_course (user_id, course_id),
  CONSTRAINT fk_enr_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS time_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  points INT NOT NULL DEFAULT 0,
  comment TEXT NULL,
  work_date DATE NOT NULL,
  rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_time_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS survey_forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  schema_json JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS survey_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  user_id INT NULL,
  answers_json JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_resp_form FOREIGN KEY (form_id) REFERENCES survey_forms(id) ON DELETE CASCADE
);

-- Access policies (dynamic authorization)
CREATE TABLE IF NOT EXISTS access_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  policy_key VARCHAR(200) UNIQUE NOT NULL,
  description VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS access_policy_roles (
  policy_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (policy_id, role_id),
  CONSTRAINT fk_apr_policy FOREIGN KEY (policy_id) REFERENCES access_policies(id) ON DELETE CASCADE,
  CONSTRAINT fk_apr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Seed default policies to admin
INSERT INTO access_policies (policy_key, description) VALUES
 ('employee.list','Employees list'),
 ('employee.create','Create employee'),
 ('employee.get','Get employee'),
 ('employee.update','Update employee'),
 ('employee.delete','Delete employee'),
 ('employee.client.assign','Assign client to employee'),
 ('employee.role.assign','Grant role to employee'),
 ('employee.role.unassign','Revoke role from employee'),
 ('access.manage','Manage access policies'),
 -- lms
 ('lms.course.read','Read LMS courses'),
 ('lms.course.write','Create/Update LMS courses'),
 ('lms.course.lesson.write','Create course lessons'),
 ('lms.enrollment.create','Enroll to a course'),
 -- appointments
 ('appointment.create','Create appointment'),
 ('appointment.list','List appointments'),
 ('appointment.update','Update appointment'),
 ('appointment.delete','Delete appointment'),
 -- assignments
 ('assignment.create','Assign employee to client'),
 ('assignment.list','List assignments'),
 -- time
 ('time.entry.create','Log time/points'),
 ('time.entry.list','List time entries'),
 ('time.scoreboard.view','View scoreboard'),
 -- surveys
 ('survey.form.create','Create survey forms'),
 ('survey.form.read','Read survey forms'),
 ('survey.response.submit','Submit survey response'),
 -- email
  ('email.send','Send email'),
  -- payroll
  ('payroll.view','View payroll'),
  -- auth
  ('auth.me','View authenticated user info'),
  ('auth.register','Register new account'),
  ('auth.login','Login with credentials')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO access_policy_roles (policy_id, role_id)
SELECT p.id, r.id FROM access_policies p JOIN roles r ON r.name = 'admin'
WHERE p.policy_key IN (
  'employee.list','employee.create','employee.get','employee.update','employee.delete','employee.client.assign','employee.role.assign','employee.role.unassign','access.manage',
  'lms.course.write','lms.course.lesson.write','appointment.create','appointment.update','appointment.delete','assignment.create','email.send','payroll.view','survey.form.create','time.entry.list','time.scoreboard.view'
)
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Admin grants for user management
INSERT INTO access_policies (policy_key, description) VALUES
 ('user.list','List users'),
 ('user.role.assign','Assign user role'),
 ('user.role.unassign','Remove user role')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO access_policy_roles (policy_id, role_id)
SELECT p.id, r.id FROM access_policies p JOIN roles r ON r.name = 'admin'
WHERE p.policy_key IN ('user.list','user.role.assign','user.role.unassign')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Non-admin defaults
-- LMS read allowed to student,developer,employee by default
INSERT INTO access_policy_roles (policy_id, role_id)
SELECT p.id, r.id FROM access_policies p JOIN roles r ON r.name IN ('student','developer','employee','admin')
WHERE p.policy_key IN ('lms.course.read','lms.enrollment.create','survey.form.read','survey.response.submit','time.entry.create','appointment.list','assignment.list')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Auth.me for all authenticated roles
INSERT INTO access_policy_roles (policy_id, role_id)
SELECT p.id, r.id FROM access_policies p JOIN roles r ON r.name IN ('guest', 'student','developer','employee','client','manager','admin')
WHERE p.policy_key IN ('auth.me')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Auth.register, Auth.login only, Public access for guest
INSERT INTO access_policy_roles (policy_id, role_id)
SELECT p.id, r.id FROM access_policies p JOIN roles r ON r.name = 'guest'
WHERE p.policy_key IN ('auth.register', 'auth.login', 'lms.course.read')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- LMS manager can write courses/lessons
INSERT INTO access_policy_roles (policy_id, role_id)
SELECT p.id, r.id FROM access_policies p JOIN roles r ON r.name = 'manager'
WHERE p.policy_key IN ('lms.course.write','lms.course.lesson.write')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Clients can create/update/delete their own appointments (policy-level grant; controller can enforce ownership)
INSERT INTO access_policy_roles (policy_id, role_id)
SELECT p.id, r.id FROM access_policies p JOIN roles r ON r.name = 'client'
WHERE p.policy_key IN ('appointment.create','appointment.update','appointment.delete','appointment.list')
ON DUPLICATE KEY UPDATE role_id = role_id;
