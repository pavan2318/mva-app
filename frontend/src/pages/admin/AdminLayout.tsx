import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import AdminLoginPage from "./AdminLoginPage"
import AdminDashboardPage from "./AdminDashboardPage"
import AdminConfigPage from "./AdminConfigPage"
import AdminLogsPage from "./AdminLogsPage"
import AdminUsersPage from "./AdminUsersPage"
import AdminHealthPage from "./AdminHealthPage"

export default function AdminLayout() {
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem("adminToken")
    if (stored) setToken(stored)
  }, [])

  const handleLogin = (jwt: string) => {
    sessionStorage.setItem("adminToken", jwt)
    setToken(jwt)
    navigate("/hackerman/dashboard")
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken")
    setToken(null)
    navigate("/hackerman/login")
  }

  if (!token) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<AdminLoginPage onLogin={handleLogin} />}
        />
        <Route
          path="*"
          element={<Navigate to="/hackerman/login" />}
        />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 p-10">
        <Routes>
          <Route
            path="/dashboard"
            element={<AdminDashboardPage token={token} onLogout={handleLogout} />}
          />

          <Route
            path="/config"
            element={<AdminConfigPage token={token} />}
          />

          <Route
            path="/logs"
            element={<AdminLogsPage token={token} />}
          />

          <Route
            path="/users"
            element={<AdminUsersPage token={token} />}
          />

          <Route
            path="/health"
            element={<AdminHealthPage token={token} />}
          />

          <Route
            path="*"
            element={<Navigate to="/hackerman/dashboard" />}
          />
        </Routes>
      </div>
    </div>
  )
}

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate()

  return (
    <div className="w-64 bg-white/70 backdrop-blur-xl border-r border-neutral-200 shadow-sm p-6 flex flex-col">
      <div className="text-xl font-semibold mb-10">
        Hackerman
      </div>

      <SidebarButton label="Dashboard" onClick={() => navigate("/hackerman/dashboard")} />
      <SidebarButton label="Config" onClick={() => navigate("/hackerman/config")} />
      <SidebarButton label="Logs" onClick={() => navigate("/hackerman/logs")} />
      <SidebarButton label="Users" onClick={() => navigate("/hackerman/users")} />
      <SidebarButton label="Health" onClick={() => navigate("/hackerman/health")} />

      <button
        onClick={onLogout}
        className="mt-auto bg-black text-white py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  )
}

function SidebarButton({
  label,
  onClick
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="text-left py-2 px-3 rounded-lg hover:bg-neutral-200 transition"
    >
      {label}
    </button>
  )
}
