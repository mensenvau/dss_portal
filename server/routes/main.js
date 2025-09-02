const express = require("express");
const app = express();

require("./auth/main")(app);
require("./auth/admin")(app);
require("./lms/main")(app);
require("./appointments/main")(app);
require("./employees/main")(app);
require("./assignments/main")(app);
require("./time/main")(app);
require("./surveys/main")(app);
require("./email/main")(app);
require("./access/main")(app);

module.exports = app;
