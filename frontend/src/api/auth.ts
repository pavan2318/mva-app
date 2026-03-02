export interface LoginStartResponse {
  loginMode: "traditional" | "mva"
  sessionId: string
  badge: string[] | null
}

export async function loginStart(email: string, mode: "real" | "phish") {
  const endpoint = mode === "real" ? "/login/start" : "/phish/start"

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })

  if (!res.ok) throw new Error("Login start failed")

  return res.json() as Promise<LoginStartResponse>
}

export async function loginComplete(
  sessionId: string,
  password: string,
  mode: "real" | "phish"
) {
  const endpoint = mode === "real" ? "/login/complete" : "/phish/complete"

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      password,
      confidenceScore: 5
    })
  })

  if (!res.ok) throw new Error("Login failed")

  return res.json()
}
