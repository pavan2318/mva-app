import { useState } from "react"

const ALL_COLUMNS = [
  "createdAt",
  "condition",
  "pageType",
  "decisionType",
  "timeToDecision",
  "confidenceScore",
  "serverDurationMs"
]

export default function AdminLogsPage({ token }: any) {
  const [logs, setLogs] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>(ALL_COLUMNS)

  const toggleColumn = (col: string) => {
    setColumns(prev =>
      prev.includes(col)
        ? prev.filter(c => c !== col)
        : [...prev, col]
    )
  }

  const runQuery = () => {
    fetch("http://localhost:5000/admin/logs/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ columns })
    })
      .then(r => r.json())
      .then(data => setLogs(data.logs))
  }

  const exportCSV = () => {
    const rows = logs.map(l =>
      columns.map(c => l[c]).join(",")
    )

    const csv =
      columns.join(",") + "\n" + rows.join("\n")

    const blob = new Blob([csv])
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "dataset.csv"
    a.click()
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Export Builder
      </h1>

      <div className="mb-4">
        {ALL_COLUMNS.map(col => (
          <label key={col} className="mr-4">
            <input
              type="checkbox"
              checked={columns.includes(col)}
              onChange={() => toggleColumn(col)}
            />
            {col}
          </label>
        ))}
      </div>

      <button
        onClick={runQuery}
        className="bg-black text-white px-4 py-2 mr-4"
      >
        Run
      </button>

      <button
        onClick={exportCSV}
        className="bg-neutral-800 text-white px-4 py-2"
      >
        Export CSV
      </button>

      <div className="mt-6 max-h-80 overflow-auto">
        {logs.map((l, i) => (
          <div key={i} className="text-xs border-b py-1">
            {columns.map(c => l[c]).join(" | ")}
          </div>
        ))}
      </div>
    </div>
  )
}
