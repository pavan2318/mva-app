import { useState } from "react"
import { loginStart, loginComplete } from "../api/auth"

type Stage = "email" | "password" | "loading" | "success"

export default function LoginPage() {
  const [stage, setStage] = useState<Stage>("email")
  const [mode, setMode] = useState<"real" | "phish">("real")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loginMode, setLoginMode] = useState<"traditional" | "mva" | null>(null)
  const [badge, setBadge] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setError(null)
      setStage("loading")

      const data = await loginStart(email, mode)

      setSessionId(data.sessionId)
      setLoginMode(data.loginMode)
      setBadge(data.badge)
      setStage("password")
    } catch {
      setError("Unable to start login.")
      setStage("email")
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionId) return

    try {
      setStage("loading")
      await loginComplete(sessionId, password, mode)
      setStage("success")
    } catch {
      setError("Invalid credentials.")
      setStage("password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-gray-200">

        <h1 className="text-2xl font-semibold text-center mb-6">
          Secure Login
        </h1>

        {/* Real / Phish Toggle */}
        <div className="flex justify-center gap-4 mb-6 text-sm">
          <button
            type="button"
            onClick={() => setMode("real")}
            className={mode === "real" ? "font-bold" : ""}
          >
            Real
          </button>
          <button
            type="button"
            onClick={() => setMode("phish")}
            className={mode === "phish" ? "font-bold text-red-600" : ""}
          >
            Phish
          </button>
        </div>

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
              className="w-full py-3 rounded-xl bg-black text-white hover:opacity-90"
            >
              Continue
            </button>
          </form>
        )}

        {stage === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">

            {loginMode === "mva" && badge && (
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
              className="w-full py-3 rounded-xl bg-black text-white hover:opacity-90"
            >
              Sign In
            </button>
          </form>
        )}

        {stage === "loading" && (
          <p className="text-center text-gray-500">Processing...</p>
        )}

        {stage === "success" && (
          <p className="text-center text-green-600">Login successful.</p>
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
