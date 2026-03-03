import KelvinBankLayout from "./KelvinBankLayout"

export default function SecurityPage() {
  const ua = navigator.userAgent

  return (
    <KelvinBankLayout>

      <div className="border p-6 rounded-md">
        <div className="font-semibold mb-4">Recent Activity</div>
        <div>Device: {ua}</div>
        <div>Location: Glasgow, UK</div>
        <div>Status: Successful login</div>
      </div>

    </KelvinBankLayout>
  )
}
