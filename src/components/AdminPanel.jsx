import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Package, CheckCircle2, Clock, IndianRupee, RefreshCw, Trash2, ShoppingBag, Settings } from 'lucide-react'
import './AdminPanel.css'

export default function AdminPanel({ onClose }) {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [settings, setSettings] = useState({
    imbEnabled: true,
    imbToken: '525593ce8133d2ccfadf4b0ddc9d8aa5',
    merchantVpa: 'paytm.s1w0x7g@pty',
    merchantName: 'BlackBox',
    imbEnv: 'sandbox',
    imbUpiIntentMode: 'api'
  })

  useEffect(() => {
    loadOrders()
    loadSettings()
  }, [])

  const loadOrders = () => {
    const stored = JSON.parse(localStorage.getItem('bb_orders') || '[]')
    setOrders(stored.reverse())
  }

  const loadSettings = () => {
    const stored = localStorage.getItem('bb_payment_settings')
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (e) {
        console.error(e)
      }
    }
  }

  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings)
    localStorage.setItem('bb_payment_settings', JSON.stringify(updatedSettings))
  }

  const clearOrders = () => {
    localStorage.removeItem('bb_orders')
    setOrders([])
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0)

  return (
    <div className="admin-overlay">
      <motion.div
        className="admin-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title">
            <Package size={20} />
            <span>Admin Dashboard</span>
          </div>
          <button className="admin-close" onClick={onClose} id="admin-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')} id="admin-orders-tab">
            <ShoppingBag size={15} /> Orders
          </button>
          <button className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')} id="admin-analytics-tab">
            <IndianRupee size={15} /> Analytics
          </button>
          <button className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')} id="admin-settings-tab">
            <Settings size={15} /> Settings
          </button>
        </div>

        {/* Stats cards */}
        {activeTab === 'orders' && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <span className="stat-card-label">Total Orders</span>
                <span className="stat-card-value">{orders.length}</span>
              </div>
              <div className="admin-stat-card">
                <span className="stat-card-label">Revenue</span>
                <span className="stat-card-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="admin-stat-card">
                <span className="stat-card-label">Successful</span>
                <span className="stat-card-value success-color">{orders.filter(o => o.status === 'success').length}</span>
              </div>
            </div>

            <div className="admin-actions">
              <button className="admin-action-btn" onClick={loadOrders}>
                <RefreshCw size={14} /> Refresh
              </button>
              <button className="admin-action-btn admin-action-danger" onClick={clearOrders}>
                <Trash2 size={14} /> Clear All
              </button>
            </div>

            <div className="admin-orders-list">
              {orders.length === 0 ? (
                <div className="admin-empty">
                  <ShoppingBag size={40} opacity={0.2} />
                  <p>No orders yet</p>
                  <p className="admin-empty-sub">Orders will appear here after payment</p>
                </div>
              ) : (
                orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    className="admin-order-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="order-icon-wrap">
                      <CheckCircle2 size={16} color="#00C896" />
                    </div>
                    <div className="order-info">
                      <span className="order-product">{order.product}</span>
                      <span className="order-meta">
                        <span className="order-method">{order.method?.toUpperCase()}</span>
                        <span className="order-date">
                          {new Date(order.date).toLocaleDateString('en-IN')}
                        </span>
                      </span>
                    </div>
                    <div className="order-right">
                      {order.price && <span className="order-price">₹{order.price.toLocaleString('en-IN')}</span>}
                      <span className={`order-status ${order.status}`}>{order.status}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="admin-analytics">
            <h4>Revenue by Product</h4>
            {['BlackBuck FASTag', 'BlackBuck GPS', 'BlackBuck Loads', 'Fuel Cards', 'BlackBuck Loans'].map(p => {
              const count = orders.filter(o => o.product === p).length
              const rev = orders.filter(o => o.product === p).reduce((s, o) => s + (o.price || 0), 0)
              return (
                <div key={p} className="analytics-row">
                  <span className="analytics-product">{p}</span>
                  <div className="analytics-bar-wrap">
                    <div className="analytics-bar"
                      style={{ width: `${Math.min(100, (count / Math.max(orders.length, 1)) * 100)}%` }} />
                  </div>
                  <span className="analytics-meta">{count} orders{rev > 0 ? ` · ₹${rev.toLocaleString('en-IN')}` : ''}</span>
                </div>
              )
            })}
            <div className="analytics-summary">
              <div className="analytics-kpi">
                <span>Total Revenue</span>
                <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
              </div>
              <div className="analytics-kpi">
                <span>Total Orders</span>
                <strong>{orders.length}</strong>
              </div>
              <div className="analytics-kpi">
                <span>Avg Order Value</span>
                <strong>₹{orders.length ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-settings">
            <h4 className="settings-title">IMB Payment Configuration</h4>
            <p className="settings-desc">Configure your IMB Payment Gateway credentials for accepting UPI payments.</p>
            
            <div className="setting-card">
              <div className="setting-row toggle-row">
                <div className="setting-label-wrap">
                  <span className="setting-label">Enable IMB Gateway</span>
                  <span className="setting-subtext">Toggle to switch from Razorpay / Demo payments to IMB Gateway.</span>
                </div>
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={settings.imbEnabled}
                    onChange={e => saveSettings({ ...settings, imbEnabled: e.target.checked })}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              {settings.imbEnabled && (
                <div className="settings-expanded">
                  <div className="setting-row">
                    <label className="input-label">Integration Mode</label>
                    <select
                      className="setting-select"
                      value={settings.imbUpiIntentMode}
                      onChange={e => saveSettings({ ...settings, imbUpiIntentMode: e.target.value })}
                    >
                      <option value="direct">Direct UPI Intent Deep-link (GPay/PhonePe/Paytm)</option>
                      <option value="api">IMB API Order Flow (https://secure.imbpayment.in)</option>
                    </select>
                    <span className="input-help">
                      {settings.imbUpiIntentMode === 'direct'
                        ? '⚡ Highly recommended: Automatically opens all installed UPI apps directly on mobile devices using upi://pay.'
                        : '🌐 API Mode: Sends a POST request to IMB servers to create an order and redirects to the payment link.'}
                    </span>
                  </div>

                  <div className="setting-row">
                    <label className="input-label">API User Token</label>
                    <input
                      type="text"
                      className="setting-input"
                      placeholder="e.g. 940149cb99886d8885f314476a994b6"
                      value={settings.imbToken}
                      onChange={e => saveSettings({ ...settings, imbToken: e.target.value })}
                    />
                    <span className="input-help">Your unique IMB Payment user_token.</span>
                  </div>

                  <div className="setting-row">
                    <label className="input-label">Merchant UPI ID (VPA)</label>
                    <input
                      type="text"
                      className="setting-input"
                      placeholder="e.g. paytm.s1w0x7g@pty"
                      value={settings.merchantVpa}
                      onChange={e => saveSettings({ ...settings, merchantVpa: e.target.value })}
                    />
                    <span className="input-help">Target UPI address where funds will be credited.</span>
                  </div>

                  <div className="setting-row">
                    <label className="input-label">Merchant Name</label>
                    <input
                      type="text"
                      className="setting-input"
                      placeholder="e.g. BlackBox"
                      value={settings.merchantName}
                      onChange={e => saveSettings({ ...settings, merchantName: e.target.value })}
                    />
                    <span className="input-help">Name displayed to customers inside GPay, PhonePe, Paytm, etc.</span>
                  </div>

                  <div className="setting-row">
                    <label className="input-label">Environment</label>
                    <select
                      className="setting-select"
                      value={settings.imbEnv}
                      onChange={e => saveSettings({ ...settings, imbEnv: e.target.value })}
                    >
                      <option value="sandbox">Sandbox / Staging (secure-stage.imb.org.in)</option>
                      <option value="production">Production (secure.imbpayment.in)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
