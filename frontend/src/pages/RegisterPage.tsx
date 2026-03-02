import { useState } from "react"

type Stage = "form" | "success" | "loading" | "error"

const emojiOptions = ["🐶","🐱","🐼","🐸","🐵","🐯","🐧","🐢"]

export default function RegisterPage() {
  const [stage, setStage] = useState<Stage>("form")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function toggleEmoji(emoji: string) {
    if (selected.includes(emoji)) {
      setSelected(selected.filter(e => e !== emoji))
    } else if (selected.length < 4) {
      setSelected([...selected, emoji])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStage("loading")

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          emojis: selected
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setStage("success")
    } catch (err: any) {
      setError(err.message)
      setStage("form")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-lg border border-gray-200">

        <h1 className="text-2xl font-semibold text-center mb-6">
          Register
        </h1>

        {stage === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              required
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <div>
              <p className="text-sm mb-2">Select 4 emojis (if assigned to MVA)</p>
              <div className="flex flex-wrap gap-3 text-2xl">
                {emojiOptions.map(e => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => toggleEmoji(e)}
                    className={`p-2 rounded-xl border ${
                      selected.includes(e)
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={selected.length !== 4}
              className="w-full py-3 rounded-xl bg-black text-white disabled:opacity-50"
            >
              Register
            </button>
          </form>
        )}

        {stage === "loading" && (
          <p className="text-center text-gray-500">Processing...</p>
        )}

        {stage === "success" && (
          <p className="text-center text-green-600">
            Registration successful. You may now log in.
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
