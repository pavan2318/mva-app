const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      email,
      noticedSomethingUnusual,
      emojiHelpedDecision,
      perceivedAuthenticity
    } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!user.round2Completed)
      return res.status(403).json({ error: "Round 2 not completed" });

    await prisma.user.update({
      where: { email },
      data: {
        noticedSomethingUnusual,
        emojiHelpedDecision,
        perceivedAuthenticity
      }
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Questionnaire failed" });
  }
});

module.exports = router;
