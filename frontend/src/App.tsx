import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import Round2LoginPage from "./pages/Round2LoginPage"
import QuestionnairePage from "./pages/QuestionnairePage"
import DebriefPage from "./pages/DebriefPage"

import BankAuthPage from "./pages/bank/BankAuthPage"
import BankAuthSessionPage from "./pages/bank/BankAuthSessionPage"
import BankDashboardPage from "./pages/bank/BankDashboardPage"
import TransferPage from "./pages/bank/TransferPage"
import BeneficiariesPage from "./pages/bank/BeneficiariesPage"
import SecurityPage from "./pages/bank/SecurityPage"

import ProtectedRoute from "./components/ProtectedRoute"

import AdminLayout from "./pages/admin/AdminLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Root */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />

        {/* Registration + Round 1 */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/round2" element={<Round2LoginPage />} />

        {/* Real Bank Authentication */}
        <Route path="/bank/auth" element={<BankAuthPage />} />
        <Route path="/bank/auth-session" element={<BankAuthSessionPage />} />

        {/* Protected Bank Area */}
        <Route
          path="/bank/dashboard"
          element={
            <ProtectedRoute>
              <BankDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bank/transfer"
          element={
            <ProtectedRoute>
              <TransferPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bank/beneficiaries"
          element={
            <ProtectedRoute>
              <BeneficiariesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bank/security"
          element={
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          }
        />

        {/* Phishing Completion Flow */}
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/debrief" element={<DebriefPage />} />

        {/* Admin */}
        <Route path="/hackerman/*" element={<AdminLayout />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
