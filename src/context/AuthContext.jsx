import { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL, authHeaders, fetchJson } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bb_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('bb_token'))
  const isAuthenticated = !!user && !!token

  useEffect(() => {
    if (user) {
      localStorage.setItem('bb_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bb_user')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('bb_token', token)
    } else {
      localStorage.removeItem('bb_token')
    }
  }, [token])

  useEffect(() => {
    const restore = async () => {
      if (!token || user) return
      try {
        const data = await fetchJson(`${API_BASE_URL}/api/auth/me`, {
          headers: { ...authHeaders() },
        })
        setUser(data.user)
      } catch {
        setUser(null)
        setToken(null)
      }
    }
    restore()
  }, [token, user])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('bb_user')
    localStorage.removeItem('bb_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
