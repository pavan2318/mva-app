import { useEffect, useState } from "react"

export default function AdminHealthPage({ token }: any) {
  const [health, setHealth] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:5000/admin/health", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async r => {
        if (!r.ok) throw new Error("Health fetch failed")
        return r.json()
      })
      .then(setHealth)
      .catch(err => {
        console.error(err)
        setError("Failed to load health data")
      })
  }, [])

  if (error) return <div className="text-red-600">{error}</div>
  if (!health) return <div>Loading...</div>

  const round1Rate =
    health.totalUsers
      ? (health.round1Completed / health.totalUsers) * 100
      : 0

  const round2Rate =
    health.totalUsers
      ? (health.round2Completed / health.totalUsers) * 100
      : 0

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Experiment Health
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <Card title="Total Users" value={health.totalUsers} />
        <Card title="Round1 Completion" value={round1Rate.toFixed(1) + "%"} />
        <Card title="Round2 Completion" value={round2Rate.toFixed(1) + "%"} />
        <Card title="MVA Users" value={health.mvaUsers} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Traffic</h2>
        <div>Real Logs: {health.realLogs}</div>
        <div>Phishing Logs: {health.phishingLogs}</div>
      </div>
    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
