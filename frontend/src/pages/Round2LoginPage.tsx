import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginStart } from "../api/auth"
import type { ApiError } from "../api/auth"

export default function Round2LoginPage() {
  const navigate = useNavigate()
  const mode: "phish" = "phish"

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await loginStart(email, mode)

      localStorage.setItem("email", email)

      // Round 2 always routes to phishing auth-session
      navigate("/bank/auth-session", {
        state: {
          badge: data.badge,
          sessionId: data.sessionId,
          loginMode: data.loginMode
        }
      })

    } catch (err) {
      const apiError = err as ApiError

      if (apiError.status === 403) {
        if (apiError.message.includes("not yet")) {
          setMessage("Payment features are not yet enabled.")
        } else {
          setMessage("Round 2 access is restricted.")
        }
      } else {
        setError(apiError.message || "Unable to start Round 2.")
      }

      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          The Kelvin & West Bank
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 text-white"
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-yellow-600 text-center">
            {message}
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
