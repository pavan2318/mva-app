import { useState } from "react"
import KelvinBankLayout from "./KelvinBankLayout"

export default function TransferPage() {
  const [amount,setAmount]=useState("")
  const [step,setStep]=useState("form")
  const [otp,setOtp]=useState("")

  return (
    <KelvinBankLayout>

      {step==="form" && (
        <div className="border p-6 rounded-md">
          <input
            placeholder="Amount"
            value={amount}
            onChange={e=>setAmount(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
          <button
            onClick={()=>setStep("otp")}
            className="ml-4 bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Continue
          </button>
        </div>
      )}

      {step==="otp" && (
        <div className="border p-6 rounded-md">
          <div className="mb-4">
            Enter one-time confirmation code sent to your device.
          </div>
          <input
            value={otp}
            onChange={e=>setOtp(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
          <button
            onClick={()=>setStep("done")}
            className="ml-4 bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Confirm Payment
          </button>
        </div>
      )}

      {step==="done" && (
        <div className="border p-6 rounded-md">
          Payment processed successfully.
        </div>
      )}

    </KelvinBankLayout>
  )
}
