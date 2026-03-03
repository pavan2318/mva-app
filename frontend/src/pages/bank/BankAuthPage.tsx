import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import KelvinAuthLayout from "./KelvinAuthLayout"
import SecurityMarker from "../../components/bank/SecurityMarker"

export default function BankAuthPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { badge, sessionId } = location.state || {}

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!sessionId) {
      navigate("/login")
    }
  }, [sessionId, navigate])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!sessionId) return

    setLoading(true)
    setError(null)

    try {
      const timeToDecision = Date.now() - startTimeRef.current

      const res = await fetch("http://localhost:5000/login/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          sessionId,
          timeToDecision,
          confidenceScore: null
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Login failed")
      }

      // ✅ SET AUTH FLAG BEFORE NAVIGATING
      localStorage.setItem("bankAuth", "true")

      navigate("/bank/dashboard")

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <KelvinAuthLayout>
      <form onSubmit={handleSubmit}>
        <SecurityMarker badge={badge} />

        <div className="mt-8">
          <label className="text-sm text-neutral-600">
            Password
          </label>

          <input
            type="password"
            required
            disabled={loading}
            className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-slate-900 text-white rounded-xl py-3 transition"
        >
          {loading ? "Processing..." : "Sign in"}
        </button>
      </form>
    </KelvinAuthLayout>
  )
}
