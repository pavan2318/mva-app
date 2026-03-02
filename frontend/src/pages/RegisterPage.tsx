import { useState } from "react"

const EMOJI_SET = ["🐶","🐱","🐼","🐸","🦊","🐻","🐵","🐧","🐢","🐙","🦄","🐝"]

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)

  function toggleEmoji(emoji: string) {
    if (selected.includes(emoji)) {
      setSelected(selected.filter(e => e !== emoji))
    } else if (selected.length < 4) {
      setSelected([...selected, emoji])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selected.length !== 4) {
      setMessage("Select exactly 4 emojis.")
      return
    }

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
    if (res.ok) {
      setMessage("Registration successful.")
    } else {
      setMessage(data.error || "Registration failed.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/80 shadow-lg border border-gray-200">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Register
        </h1>

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

          <div className="grid grid-cols-6 gap-2 text-2xl">
            {EMOJI_SET.map(emoji => (
              <button
                type="button"
                key={emoji}
                onClick={() => toggleEmoji(emoji)}
                className={`p-2 rounded-lg border ${
                  selected.includes(emoji)
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-black text-white"
          >
            Create Account
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
