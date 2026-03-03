const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

module.exports = async function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId }
    });

    if (!admin)
      return res.status(401).json({ error: "Invalid admin" });

    req.admin = admin;
    next();

  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
