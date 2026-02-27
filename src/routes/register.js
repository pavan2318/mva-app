const express = require("express");
const bcrypt = require("bcrypt");
const { deriveBadgeSecret } = require("../services/badgeService");
const prisma = require("../prisma");

const router = express.Router();

async function assignBalancedCondition() {
  const traditionalCount = await prisma.user.count({
    where: { loginMode: "traditional" }
  });

  const mvaCount = await prisma.user.count({
    where: { loginMode: "mva" }
  });

  // If equal → random
  if (traditionalCount === mvaCount) {
    return Math.random() < 0.5 ? "traditional" : "mva";
  }

  // Otherwise assign to smaller group
  return traditionalCount < mvaCount ? "traditional" : "mva";
}

router.post("/", async (req, res) => {
  try {
    const { email, password, emojis } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const loginMode = await assignBalancedCondition();

    if (loginMode === "mva") {
      if (!emojis || emojis.length !== 4) {
        return res.status(400).json({ error: "MVA users must select 4 emojis" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      let badgeSecret = null;

      if (loginMode === "mva") {
        badgeSecret = deriveBadgeSecret(
          process.env.MVA_MASTER_KEY,
          email,
          emojis
        );
      }

      return tx.user.create({
        data: {
          email,
          passwordHash,
          loginMode,
          badgeSecret
        }
      });
    });

    res.json({
      success: true,
      loginMode
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
