import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function QuestionnairePage() {
  const navigate = useNavigate()

  const [noticed, setNoticed] = useState<boolean | null>(null)
  const [emojiHelped, setEmojiHelped] = useState<boolean | null>(null)
  const [authenticity, setAuthenticity] = useState<number>(3)
  const [submitting, setSubmitting] = useState(false)

  const email = localStorage.getItem("email")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (noticed === null || emojiHelped === null) return

    setSubmitting(true)

    await fetch("/questionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        noticedSomethingUnusual: noticed,
        emojiHelpedDecision: emojiHelped,
        perceivedAuthenticity: authenticity
      })
    })

    navigate("/debrief")
  }

  function yesNoButton(
    value: boolean,
    current: boolean | null,
    setter: (v: boolean) => void
  ) {
    return (
      <button
        type="button"
        onClick={() => setter(value)}
        className={`px-4 py-2 rounded-xl border ${
          current === value
            ? "bg-black text-white border-black"
            : "border-gray-300"
        }`}
      >
        {value ? "Yes" : "No"}
      </button>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-lg border border-gray-200 space-y-6">

        <h1 className="text-xl font-semibold text-center">
          Short Questionnaire
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <p>Did you notice anything unusual?</p>
            <div className="flex gap-4">
              {yesNoButton(true, noticed, setNoticed)}
              {yesNoButton(false, noticed, setNoticed)}
            </div>
          </div>

          <div className="space-y-2">
            <p>Did the emojis influence your decision?</p>
            <div className="flex gap-4">
              {yesNoButton(true, emojiHelped, setEmojiHelped)}
              {yesNoButton(false, emojiHelped, setEmojiHelped)}
            </div>
          </div>

          <div className="space-y-2">
            <p>How authentic did the page feel? (1–5)</p>
            <input
              type="range"
              min="1"
              max="5"
              value={authenticity}
              onChange={e => setAuthenticity(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {authenticity}
            </div>
          </div>

          <button
            type="submit"
            disabled={noticed === null || emojiHelped === null || submitting}
            className="w-full py-3 rounded-xl bg-black text-white disabled:opacity-50"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  )
}
