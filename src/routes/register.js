const express = require("express");
const bcrypt = require("bcrypt");
const { deriveBadgeSecret } = require("../services/badgeService");
const prisma = require("../prisma");

const router = express.Router();

function randomCondition() {
  return "mva";
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

    const loginMode = randomCondition();

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        loginMode
      }
    });

    let badgeSecret = null;

    if (loginMode === "mva") {
      if (!emojis || emojis.length !== 4) {
        return res.status(400).json({ error: "MVA users must select 4 emojis" });
      }

      badgeSecret = deriveBadgeSecret(
        process.env.MVA_MASTER_KEY,
        user.id,
        emojis
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { badgeSecret }
      });
    }

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
