import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function AdminDashboardPage({ token }: any) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("http://localhost:5000/admin/logs/compare", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  const chartData = [
    {
      name: "MVA",
      rate: data.phishing.mva.submitRate * 100
    },
    {
      name: "Traditional",
      rate: data.phishing.traditional.submitRate * 100
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Phishing Resistance Comparison
      </h1>

      <div className="mb-8">
        <div>
          Delta Submit Rate:{" "}
          {(data.phishing.deltaSubmit * 100).toFixed(2)}%
        </div>
        <div>
          Delta Avg Time:{" "}
          {data.phishing.deltaTime.toFixed(0)} ms
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
