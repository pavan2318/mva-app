import { createContext, useContext, useState } from "react"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: any) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
