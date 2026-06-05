import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bb_user')
    return saved ? JSON.parse(saved) : null
  })

  // Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('bb_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bb_user')
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bb_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
