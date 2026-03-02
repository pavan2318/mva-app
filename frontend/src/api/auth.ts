export interface LoginStartResponse {
  loginMode: "traditional" | "mva"
  sessionId: string
  badge: string[] | null
}

export interface ApiError {
  status: number
  message: string
}

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.error || "Request failed"
    } as ApiError
  }

  return data
}

export async function loginStart(
  email: string,
  mode: "real" | "phish"
): Promise<LoginStartResponse> {
  const endpoint =
    mode === "real" ? "/login/start" : "/phish/start"

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })

  return handleResponse(res)
}

export async function loginComplete(
  sessionId: string,
  password: string,
  mode: "real" | "phish"
) {
  const endpoint =
    mode === "real" ? "/login/complete" : "/phish/complete"

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      password,
      confidenceScore: 5
    })
  })

  return handleResponse(res)
}
