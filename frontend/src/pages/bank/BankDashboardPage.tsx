import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KelvinBankLayout from "./KelvinBankLayout"

export default function BankDashboardPage() {
  const navigate = useNavigate()

  const name = localStorage.getItem("bankUserName") || "Customer"
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [account, setAccount] = useState("Current")

  const accounts: any = {
    Current: {
      number: "**** 4832",
      balance: 180.62
    },
    Savings: {
      number: "**** 9021",
      balance: 3200.00
    }
  }

  const transactions = [
    { id: 1, desc: "Initial Deposit", amount: 250.00, date: "02 Mar 2026", ref: "DEP84211" },
    { id: 2, desc: "Coffee Roasters", amount: -12.40, date: "01 Mar 2026", ref: "CR12902" },
    { id: 3, desc: "Online Retail", amount: -48.99, date: "28 Feb 2026", ref: "OR77812" },
    { id: 4, desc: "Streaming Service", amount: -7.99, date: "27 Feb 2026", ref: "SS55421" }
  ]

  function handleLogout() {
    localStorage.removeItem("bankAuth")
    navigate("/home")
  }

  const currentAccount = accounts[account]

  return (
    <KelvinBankLayout>

      {/* Welcome */}
      <div className="mb-6">
        <div className="text-sm text-neutral-500">
          Welcome back,
        </div>
        <div className="text-xl font-semibold">
          {name}
        </div>
      </div>

      {/* Account Header */}
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4 mb-6">

        <div>
          <div className="text-sm text-neutral-500">
            Personal {account} Account
          </div>
          <div className="text-lg font-semibold">
            {currentAccount.number}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={account}
            onChange={e => setAccount(e.target.value)}
            className="border border-neutral-300 px-3 py-1 rounded-md text-sm"
          >
            {Object.keys(accounts).map(a => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <button
            onClick={handleLogout}
            className="text-sm text-neutral-600 hover:text-black"
          >
            Sign out
          </button>
        </div>

      </div>

      {/* Secure Session Banner */}
      <div className="bg-neutral-100 border border-neutral-200 rounded-md px-4 py-3 text-sm text-neutral-700 mb-8">
        Secure session active · {navigator.userAgent.includes("Mobile") ? "Mobile Browser" : "Desktop Browser"} · Last login: Today 08:42
      </div>

      {/* Balance Section */}
      <div className="bg-white border border-neutral-200 rounded-md p-6 mb-8">
        <div className="text-sm text-neutral-500">
          Current Balance
        </div>
        <div className="text-3xl font-semibold mt-2">
          £{currentAccount.balance.toFixed(2)}
        </div>
        <div className="text-xs text-neutral-500 mt-2">
          Available funds
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white border border-neutral-200 rounded-md">
        <div className="px-6 py-4 border-b border-neutral-200 font-semibold">
          Recent Transactions
        </div>

        <div className="divide-y divide-neutral-200">
          {transactions.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTx(t)}
              className="flex justify-between px-6 py-4 text-sm cursor-pointer hover:bg-neutral-50"
            >
              <div>
                <div>{t.desc}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {t.date}
                </div>
              </div>

              <div
                className={`font-medium ${
                  t.amount < 0 ? "text-black" : "text-green-700"
                }`}
              >
                {t.amount > 0 ? "+" : ""}£{Math.abs(t.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-80 rounded-md p-6">
            <div className="font-semibold mb-2">
              {selectedTx.desc}
            </div>

            <div className="text-sm text-neutral-600 mb-2">
              Date: {selectedTx.date}
            </div>

            <div className="text-sm text-neutral-600 mb-2">
              Reference: {selectedTx.ref}
            </div>

            <div className="text-sm text-neutral-600 mb-4">
              Amount: {selectedTx.amount > 0 ? "+" : ""}£{Math.abs(selectedTx.amount).toFixed(2)}
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full bg-red-700 text-white py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </KelvinBankLayout>
  )
}
