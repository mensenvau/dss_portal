const jwt = require("jsonwebtoken");
const { getAllowedRoles } = require("../functions/access");

// Dynamic policy-based access controlled from DB
function access(policy_key_or_resolver) {
  return async (req, res, next) => {
    // attach user (guest by default)
    const auth_header = req.headers["authorization"] || "";
    const token = auth_header.startsWith("Bearer ") ? auth_header.slice(7) : null;
    req.user = { id: null, email: null, roles: [], name: null };
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.APP_JWT_ACCESS_SECRET);
        req.user = payload && typeof payload === "object" ? payload : req.user;
      } catch (_) {
        // keep guest
      }
    }

    try {
      const key = typeof policy_key_or_resolver === "function" ? policy_key_or_resolver(req) : policy_key_or_resolver;
      const allowed = new Set(await getAllowedRoles(key));
      const effective = new Set([req.user.role || "guest", ...(req.user.roles || [])]);
      if (effective.has("admin")) return next();
      for (const r of effective) {
        if (allowed.has(r)) return next();
      }
      return res.status(403).json({ ok: false, error: "Forbidden" });
    } catch (e) {
      return next(e);
    }
  };
}

function admin(u) {
  return u && (u.role === "admin" || (Array.isArray(u.roles) && u.roles.includes("admin")));
}

module.exports = { access, admin };
