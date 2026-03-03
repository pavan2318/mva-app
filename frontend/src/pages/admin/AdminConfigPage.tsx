import { useEffect, useState } from "react"

interface Props {
  token: string
}

export default function AdminConfigPage({ token }: Props) {
  const [history, setHistory] = useState<any[]>([])
  const [draft, setDraft] = useState<any>(null)

  const fetchConfig = async () => {
    const res = await fetch("http://localhost:5000/admin/config", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    // Only keep what we actually use
    setHistory(data.history)
    setDraft(data.active)
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const applyChanges = async () => {
    await fetch("http://localhost:5000/admin/config/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(draft)
    })

    fetchConfig()
  }

  const rollback = async (versionId: string) => {
    await fetch(
      `http://localhost:5000/admin/config/rollback/${versionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    fetchConfig()
  }

  if (!draft) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Config Manager</h1>

      <div className="grid grid-cols-2 gap-10">
        <div className="backdrop-blur-xl bg-white/70 border border-neutral-200 shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Active Configuration
          </h2>

          <ConfigInput
            label="Round 2 Delay (hours)"
            value={draft.round2DelayHours}
            onChange={(v) =>
              setDraft({
                ...draft,
                round2DelayHours: parseFloat(v)
              })
            }
          />

          <ConfigInput
            label="Session Expiry (minutes)"
            value={draft.sessionExpiryMinutes}
            onChange={(v) =>
              setDraft({
                ...draft,
                sessionExpiryMinutes: parseInt(v)
              })
            }
          />

          <ToggleInput
            label="Throttle Enabled"
            value={draft.throttleEnabled}
            onChange={(v) =>
              setDraft({ ...draft, throttleEnabled: v })
            }
          />

          <ToggleInput
            label="Experiment Active"
            value={draft.experimentActive}
            onChange={(v) =>
              setDraft({ ...draft, experimentActive: v })
            }
          />

          <ToggleInput
            label="Allow Retakes"
            value={draft.allowRetakes}
            onChange={(v) =>
              setDraft({ ...draft, allowRetakes: v })
            }
          />

          <ToggleInput
            label="Auto Log Timeout"
            value={draft.autoLogTimeout}
            onChange={(v) =>
              setDraft({ ...draft, autoLogTimeout: v })
            }
          />

          <button
            onClick={applyChanges}
            className="mt-6 bg-black text-white px-6 py-2 rounded-lg"
          >
            Apply Changes
          </button>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-neutral-200 shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Version History
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((v) => (
              <div
                key={v.id}
                className="border border-neutral-200 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    Version {v.versionNumber}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Delay: {v.round2DelayHours}h
                  </div>
                </div>

                <button
                  onClick={() => rollback(v.id)}
                  className="text-sm bg-neutral-900 text-white px-3 py-1 rounded-lg"
                >
                  Rollback
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigInput({
  label,
  value,
  onChange
}: {
  label: string
  value: number
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-neutral-600 mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg border border-neutral-300"
      />
    </div>
  )
}

function ToggleInput({
  label,
  value,
  onChange
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex justify-between items-center mb-3">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  )
}
