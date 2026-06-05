import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, authHeaders, fetchJson } from '../utils/api'
import './ProductPage.css'

export default function AdminPage() {
  const { user, login, logout, isAuthenticated } = useAuth()
  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const [, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [authError, setAuthError] = useState('')
  const navigate = useNavigate()

  const isAdmin = isAuthenticated && user?.role === 'super_admin'

  const loadAdminData = async () => {
    setLoading(true)
    setError('')
    try {
      const summaryData = await fetchJson(`${API_BASE_URL}/api/admin/summary`, {
        headers: { ...authHeaders() },
      })
      const usersData = await fetchJson(`${API_BASE_URL}/api/admin/users`, {
        headers: { ...authHeaders() },
      })
      const paymentsData = await fetchJson(`${API_BASE_URL}/api/admin/payments`, {
        headers: { ...authHeaders() },
      })
      setSummary(summaryData.data)
      setUsers(usersData.users)
      setPayments(paymentsData.payments)
    } catch (err) {
      setError(err.data?.message || err.message || 'Unable to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadAdminData()
    }
  }, [isAdmin])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    try {
      const data = await fetchJson(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      login(data.user, data.token)
    } catch (err) {
      setAuthError(err.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
      </div>

      {!isAdmin ? (
        <div className="admin-login-card">
          <h2>Admin Login</h2>
          <p>Use the account with role <strong>super_admin</strong>.</p>
          {authError && <div className="error-message">{authError}</div>}
          <form onSubmit={handleLogin} className="admin-login-form">
            <label>Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button className="btn-primary" type="submit">Login as Admin</button>
          </form>
          {isAuthenticated && (
            <button className="btn-secondary" onClick={logout}>Logout user</button>
          )}
        </div>
      ) : (
        <div className="admin-dashboard">
          <div className="admin-summary-grid">
            <div className="summary-card">
              <span>Total Users</span>
              <strong>{summary?.totalUsers ?? '—'}</strong>
            </div>
            <div className="summary-card">
              <span>Total Payments</span>
              <strong>{summary?.totalPayments ?? '—'}</strong>
            </div>
            <div className="summary-card">
              <span>Revenue</span>
              <strong>₹{summary?.revenue?.toLocaleString('en-IN') ?? 0}</strong>
            </div>
            <div className="summary-card">
              <span>Wallet Credits</span>
              <strong>₹{summary?.walletCredits?.toLocaleString('en-IN') ?? 0}</strong>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <section className="admin-table-section">
            <h2>Recent Payments</h2>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.order_id}</td>
                      <td>{payment.name || payment.username || payment.mobile}</td>
                      <td>₹{payment.amount?.toLocaleString('en-IN')}</td>
                      <td>{payment.status}</td>
                      <td>{new Date(payment.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-table-section">
            <h2>Users</h2>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Wallet</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name || u.username}</td>
                      <td>{u.mobile || '-'}</td>
                      <td>{u.role}</td>
                      <td>₹{u.wallet_balance?.toLocaleString('en-IN')}</td>
                      <td>{u.blocked ? 'Blocked' : 'Active'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
