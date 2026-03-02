import { useState } from "react"
import { loginStart, loginComplete } from "../api/auth"
import type { ApiError } from "../api/auth"

type Stage =
  | "email"
  | "password"
  | "loading"
  | "completed"
  | "notAvailable"
  | "locked"
  | "error"

export default function Round2LoginPage() {
  const mode: "phish" = "phish"

  const [stage, setStage] = useState<Stage>("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loginMode, setLoginMode] = useState<"traditional" | "mva" | null>(null)
  const [badge, setBadge] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStage("loading")

    try {
      const data = await loginStart(email, mode)

      setSessionId(data.sessionId)
      setLoginMode(data.loginMode)
      setBadge(data.badge)
      setStage("password")
    } catch (err) {
      const apiError = err as ApiError

      if (apiError.status === 403) {
        if (apiError.message.includes("not yet")) {
          setStage("notAvailable")
        } else if (apiError.message.includes("already")) {
          setStage("completed")
        } else {
          setStage("locked")
        }
      } else {
        setError(apiError.message || "Unable to start Round 2.")
        setStage("email")
      }
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionId) return

    setError(null)
    setStage("loading")

    try {
      await loginComplete(sessionId, password, mode)
      setStage("completed")
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Invalid credentials.")
      setStage("password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-lg border border-gray-200">

        <h1 className="text-2xl font-semibold text-center mb-6">
          Secure Login
        </h1>

        {stage === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-black text-white"
            >
              Continue
            </button>
          </form>
        )}

        {stage === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">

            {loginMode === "mva" && badge?.length === 4 && (
              <div className="flex justify-center gap-3 text-3xl">
                {badge.map((emoji, i) => (
                  <span key={i}>{emoji}</span>
                ))}
              </div>
            )}

            <input
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-black text-white"
            >
              Sign In
            </button>
          </form>
        )}

        {stage === "loading" && (
          <p className="text-center text-gray-500">Processing...</p>
        )}

        {stage === "notAvailable" && (
          <p className="text-center text-yellow-600">
            Round 2 is not yet available. Please return after 48 hours.
          </p>
        )}

        {stage === "completed" && (
          <p className="text-center text-green-600">
            Thank you for participating. Please proceed to the questionnaire.
          </p>
        )}

        {stage === "locked" && (
          <p className="text-center text-gray-600">
            Round 2 access is restricted.
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
