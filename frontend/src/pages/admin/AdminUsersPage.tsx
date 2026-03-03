import { useEffect, useState } from "react"

export default function AdminUsersPage({ token }: any) {
  const [users, setUsers] = useState<any[]>([])

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setUsers(data)
  }

  const resetUser = async (id: string) => {
    await fetch(`http://localhost:5000/admin/users/reset/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchUsers()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">User Console</h1>

      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className="bg-white shadow rounded-xl p-4 flex justify-between">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-sm text-neutral-500">
                {u.loginMode} | R1: {u.round1CompletedAt ? "✔" : "✘"} | R2: {u.round2Completed ? "✔" : "✘"}
              </div>
            </div>

            <button
              onClick={() => resetUser(u.id)}
              className="bg-black text-white px-4 py-1 rounded"
            >
              Reset
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
