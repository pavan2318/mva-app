export default function KelvinAuthLayout({ children }: any) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            The Kelvin & West Bank
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
