export interface LoginStartResponse {
  loginMode: "traditional" | "mva"
  sessionId: string
  badge: string[] | null
}

export async function loginStart(email: string): Promise<LoginStartResponse> {
  const res = await fetch("/login/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })

  if (!res.ok) {
    throw new Error("Login start failed")
  }

  return res.json()
}

export async function loginComplete(
  sessionId: string,
  password: string
) {
  const res = await fetch("/login/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, password, confidenceScore: 5 })
  })

  if (!res.ok) {
    throw new Error("Login failed")
  }

  return res.json()
}
