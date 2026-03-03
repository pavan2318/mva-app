module.exports = function superAdminOnly(req, res, next) {
  if (req.admin.role !== "SUPERADMIN")
    return res.status(403).json({ error: "SuperAdmin only" });

  next();
};
