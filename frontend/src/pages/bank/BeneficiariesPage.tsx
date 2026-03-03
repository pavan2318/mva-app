import { useState } from "react"
import KelvinBankLayout from "./KelvinBankLayout"

export default function BeneficiariesPage() {
  const [payees, setPayees] = useState<any[]>([])
  const [name, setName] = useState("")

  function addPayee() {
    setPayees([...payees, { name, active:false }])
    setName("")
  }

  return (
    <KelvinBankLayout>

      <div className="border border-neutral-200 p-6 rounded-md mb-6">
        <div className="text-sm text-neutral-600 mb-2">
          New payees become active after 48 hours for security reasons.
        </div>

        <input
          placeholder="Payee Name"
          className="border px-4 py-2 rounded-md mr-2"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <button
          onClick={addPayee}
          className="bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>

      {payees.map((p,i)=>(
        <div key={i} className="border p-4 rounded-md mb-2">
          {p.name} – Pending Activation
        </div>
      ))}

    </KelvinBankLayout>
  )
}
