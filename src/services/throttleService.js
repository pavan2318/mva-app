const { getRuntimeConfig } = require("./runtimeConfig")

const attempts = new Map()

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10

async function recordAttempt(email) {
  const now = Date.now()

  if (!attempts.has(email)) {
    attempts.set(email, [])
  }

  const timestamps = attempts.get(email)

  const filtered = timestamps.filter(
    (ts) => now - ts < WINDOW_MS
  )

  filtered.push(now)

  attempts.set(email, filtered)
}

async function isBlocked(email) {
  const config = await getRuntimeConfig()

  // Admin disabled throttle
  if (!config?.throttleEnabled) return false

  const now = Date.now()
  const timestamps = attempts.get(email) || []

  const filtered = timestamps.filter(
    (ts) => now - ts < WINDOW_MS
  )

  return filtered.length >= MAX_ATTEMPTS
}

module.exports = {
  recordAttempt,
  isBlocked
}
