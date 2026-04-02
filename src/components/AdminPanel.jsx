import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Package, CheckCircle2, Clock, IndianRupee, RefreshCw, Trash2, ShoppingBag } from 'lucide-react'
import './AdminPanel.css'

export default function AdminPanel({ onClose }) {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const stored = JSON.parse(localStorage.getItem('bb_orders') || '[]')
    setOrders(stored.reverse())
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
      </motion.div>
    </div>
  )
}
