import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginStart } from "../api/auth"
import type { ApiError } from "../api/auth"

export default function LoginPage() {
  const navigate = useNavigate()
  const mode: "real" = "real"

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await loginStart(email, mode)

      // Move to real bank authentication step
      navigate("/bank/auth", {
        state: {
          badge: data.badge,
          sessionId: data.sessionId,
          loginMode: data.loginMode
        }
      })

    } catch (err) {
      const apiError = err as ApiError

      if (apiError.status === 403) {
        // Round 1 already completed → go to Round 2 flow
        navigate("/round2")
      } else {
        setError(apiError.message || "Unable to start login.")
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-md p-8">

        <h1 className="text-xl font-semibold text-center mb-6">
          The Kelvin & West Bank
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full px-4 py-3 border border-neutral-300 rounded-md"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-md"
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <div className="mt-6 text-xs text-neutral-500 text-center">
          Your session is encrypted and protected.
        </div>

      </div>
    </div>
  )
}
