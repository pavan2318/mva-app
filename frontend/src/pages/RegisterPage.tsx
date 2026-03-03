import { useState } from "react"
import { useNavigate } from "react-router-dom"

type Stage = "email" | "details" | "loading" | "success"

const emojiOptions = ["🐶","🐱","🐼","🐸","🐵","🐯","🐧","🐢"]

export default function RegisterPage() {
  const navigate = useNavigate()

  const [stage, setStage] = useState<Stage>("email")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMode, setLoginMode] = useState<"traditional" | "mva" | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function toggleEmoji(emoji: string) {
    if (selected.includes(emoji)) {
      setSelected(selected.filter(e => e !== emoji))
    } else if (selected.length < 4) {
      setSelected([...selected, emoji])
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStage("loading")

    try {
      const res = await fetch("/register/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unable to continue")

      setLoginMode(data.loginMode)
      setStage("details")

    } catch (err: any) {
      setError(err.message)
      setStage("email")
    }
  }

  async function handleCompleteSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStage("loading")

    try {
      const res = await fetch("/register/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          loginMode,
          emojis: loginMode === "mva" ? selected : []
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")

      setStage("success")

    } catch (err: any) {
      setError(err.message)
      setStage("details")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-md p-8">

        <h1 className="text-xl font-semibold text-center mb-6">
          Open an Account
        </h1>

        {stage === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">

            <input
              required
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-neutral-300 rounded-md"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-neutral-300 rounded-md"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-md"
            >
              Continue
            </button>
          </form>
        )}

        {stage === "details" && (
          <form onSubmit={handleCompleteSubmit} className="space-y-4">

            <input
              type="password"
              required
              placeholder="Create Password"
              className="w-full px-4 py-3 border border-neutral-300 rounded-md"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {loginMode === "mva" && (
              <div>
                <p className="text-sm mb-2">
                  Choose 4 security icons
                </p>
                <div className="flex flex-wrap gap-3 text-2xl">
                  {emojiOptions.map(e => (
                    <button
                      type="button"
                      key={e}
                      onClick={() => toggleEmoji(e)}
                      className={`p-2 border rounded-md ${
                        selected.includes(e)
                          ? "border-red-700"
                          : "border-neutral-300"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loginMode === "mva" && selected.length !== 4}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-md disabled:opacity-50"
            >
              Complete Registration
            </button>
          </form>
        )}

        {stage === "success" && (
          <div className="text-center space-y-6">
            <p className="text-green-700 font-medium">
              Account created successfully.
            </p>
            <p className="text-sm text-neutral-600">
              You may now sign in to access your account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-md"
            >
              Sign In
            </button>
          </div>
        )}

        {stage === "loading" && (
          <p className="text-center text-neutral-500">
            Processing...
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

      </div>
    </div>
  )
}
