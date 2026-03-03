import { useEffect, useState } from "react"

export default function AdminAuditPage({ token }: any) {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/admin/audit", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setLogs)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Audit Timeline
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-h-96 overflow-auto">
        {logs.map(l => (
          <div key={l.id} className="border-b py-2 text-sm">
            {new Date(l.createdAt).toLocaleString()} |
            {l.admin.email} |
            {l.action}
          </div>
        ))}
      </div>
    </div>
  )
}
