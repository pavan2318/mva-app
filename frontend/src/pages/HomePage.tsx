import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">

      {/* Top Bar */}
      <header className="flex justify-between items-center px-10 py-6 bg-white border-b border-neutral-200">
        <div className="text-xl font-semibold tracking-tight">
          The Kelvin & West Bank
        </div>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg text-sm border border-neutral-300 hover:bg-neutral-100 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-lg text-sm bg-slate-900 text-white hover:opacity-90 transition"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl font-semibold max-w-3xl leading-tight">
          Modern banking. Designed for clarity.
        </h1>

        <p className="mt-6 text-neutral-600 max-w-2xl text-lg">
          Secure digital banking built with advanced verification technology,
          transparent controls, and real-time account management.
        </p>

        <div className="mt-10 space-x-6">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 rounded-xl bg-slate-900 text-white text-lg shadow-md hover:opacity-90 transition"
          >
            Open an Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-xl border border-neutral-300 text-lg hover:bg-neutral-100 transition"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 px-12 pb-20 max-w-6xl mx-auto">
        <Feature
          title="Advanced Session Security"
          description="Dynamic session-based verification to protect your account."
        />
        <Feature
          title="Real-Time Payments"
          description="Instant transfers with multi-layer confirmation."
        />
        <Feature
          title="Privacy First"
          description="Minimal data retention and secure infrastructure."
        />
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-neutral-500 py-10 border-t border-neutral-200">
        © 2026 The Kelvin & West Bank. All rights reserved.
      </footer>
    </div>
  )
}

function Feature({ title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-neutral-600">{description}</p>
    </div>
  )
}
