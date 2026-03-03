import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

export default function KelvinBankLayout({ children }: any) {
  const location = useLocation()
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  function navClass(path: string) {
    const active = location.pathname === path
    return `pb-3 border-b-2 text-sm ${
      active
        ? "border-red-700 text-black font-medium"
        : "border-transparent text-neutral-600 hover:text-black"
    }`
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Trust Strip */}
      <div className="bg-neutral-100 text-xs text-neutral-600 px-4 py-2 border-b border-neutral-200">
        FCA Regulated · FSCS Protected · 256-bit encryption · Protected by UK Financial Services Scheme
      </div>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between">
        <div className="font-semibold">
          The Kelvin & West Bank
        </div>
        <div className="text-sm text-neutral-600">
          Your session is encrypted and protected. · {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2,"0")}
        </div>
      </div>

      {/* Nav */}
      <div className="bg-white border-b border-neutral-200 px-6 flex space-x-8">
        <Link to="/bank/dashboard" className={navClass("/bank/dashboard")}>
          Accounts
        </Link>
        <Link to="/bank/transfer" className={navClass("/bank/transfer")}>
          Payments
        </Link>
        <Link to="/bank/beneficiaries" className={navClass("/bank/beneficiaries")}>
          Beneficiaries
        </Link>
        <Link to="/bank/security" className={navClass("/bank/security")}>
          Security Centre
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden flex justify-around py-3 text-xs">
        <Link to="/bank/dashboard">Accounts</Link>
        <Link to="/bank/transfer">Pay</Link>
        <Link to="/bank/security">Security</Link>
      </div>

    </div>
  )
}
