const crypto = require("crypto");

const EMOJI_SET = [
  "🐶","🐱","🦊","🐻",
  "🐼","🐸","🦁","🐵",
  "🐔","🐧","🐢","🐙",
  "🦄","🐝","🐞","🦋"
];

function hmac(key, data) {
  return crypto
    .createHmac("sha256", key)
    .update(data)
    .digest();
}

function deriveBadgeSecret(masterKey, userId, emojiSequence) {
  const payload = `${userId}:${emojiSequence.join("")}`;
  return hmac(masterKey, payload).toString("hex");
}

function generateNonce() {
  return crypto.randomBytes(16).toString("hex");
}

function deriveDynamicBadge(badgeSecret, nonce) {
  const hash = hmac(badgeSecret, nonce);
  
  const emojis = [];
  for (let i = 0; i < 4; i++) {
    const byte = hash[i];
    const index = byte % EMOJI_SET.length;
    emojis.push(EMOJI_SET[index]);
  }

  return emojis;
}

module.exports = {
  deriveBadgeSecret,
  deriveDynamicBadge,
  generateNonce,
  EMOJI_SET
};
