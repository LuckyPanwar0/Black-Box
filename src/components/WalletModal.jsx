import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { X, Wallet, Plus, ArrowDown, ArrowUp, TrendingUp, CheckCircle2 } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import './WalletModal.css'

const ADD_AMOUNTS = [500, 1000, 2000, 5000]

export default function WalletModal({ onClose }) {
  const { balance, transactions, addMoney } = useWallet()
  const [tab, setTab] = useState('balance') // balance | add | history
  const [customAmt, setCustomAmt] = useState('')
  const [selectedAmt, setSelectedAmt] = useState(null)
  const [added, setAdded] = useState(false)

  const handleAdd = async () => {
    const amt = parseFloat(customAmt) || selectedAmt
    if (!amt || amt <= 0 || amt > 100000) return
    const result = await addMoney(amt, 'Added to BlackBuck Wallet')
    if (!result.success) {
      return
    }
    setAdded(true)
    setCustomAmt('')
    setSelectedAmt(null)
    setTimeout(() => { setAdded(false); setTab('balance') }, 1800)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="wallet-modal"
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Close */}
        <button className="modal-close" onClick={onClose} id="wallet-close-btn">
          <X size={18} />
        </button>

        {/* Balance card */}
        <div className="wallet-balance-card">
          <div className="wallet-icon-wrap">
            <Wallet size={22} />
          </div>
          <div className="wallet-balance-info">
            <span className="wallet-balance-label">BlackBuck Wallet</span>
            <span className="wallet-balance-value">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="wallet-badge">Active</div>
        </div>

        {/* Tabs */}
        <div className="wallet-tabs">
          <button className={`wallet-tab ${tab === 'balance' ? 'active' : ''}`}
            onClick={() => setTab('balance')} id="wallet-tab-balance">
            <TrendingUp size={14} /> Overview
          </button>
          <button className={`wallet-tab ${tab === 'add' ? 'active' : ''}`}
            onClick={() => setTab('add')} id="wallet-tab-add">
            <Plus size={14} /> Add Money
          </button>
          <button className={`wallet-tab ${tab === 'history' ? 'active' : ''}`}
            onClick={() => setTab('history')} id="wallet-tab-history">
            History
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Overview tab */}
          {tab === 'balance' && (
            <motion.div key="balance" className="wallet-tab-content"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
            >
              <div className="wallet-stats-grid">
                <div className="wallet-stat">
                  <ArrowUp size={16} color="#00C896" />
                  <div>
                    <span className="wstat-label">Total Added</span>
                    <span className="wstat-val credit">
                      ₹{transactions.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="wallet-stat">
                  <ArrowDown size={16} color="#FF2D55" />
                  <div>
                    <span className="wstat-label">Total Spent</span>
                    <span className="wstat-val debit">
                      ₹{transactions.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="wallet-stat">
                  <TrendingUp size={16} color="#6A0DAD" />
                  <div>
                    <span className="wstat-label">Transactions</span>
                    <span className="wstat-val">{transactions.length}</span>
                  </div>
                </div>
              </div>

              {/* Recent */}
              {transactions.length > 0 && (
                <div className="wallet-recent">
                  <h4>Recent Transactions</h4>
                  {transactions.slice(0, 4).map(txn => (
                    <div key={txn.id} className="txn-row">
                      <div className={`txn-icon ${txn.type}`}>
                        {txn.type === 'credit' ? <ArrowDown size={14}/> : <ArrowUp size={14}/>}
                      </div>
                      <div className="txn-info">
                        <span className="txn-desc">{txn.description}</span>
                        <span className="txn-date">{new Date(txn.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <span className={`txn-amount ${txn.type}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button className="wallet-cta-btn" onClick={() => setTab('add')} id="wallet-add-now-btn">
                <Plus size={16} /> Add Money to Wallet
              </button>
            </motion.div>
          )}

          {/* Add Money tab */}
          {tab === 'add' && (
            <motion.div key="add" className="wallet-tab-content"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
            >
              {added ? (
                <div className="wallet-added-success">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280 }}>
                    <CheckCircle2 size={44} color="#00C896" />
                  </motion.div>
                  <p>Money Added Successfully!</p>
                </div>
              ) : (
                <>
                  <label className="wallet-add-label">Select Amount</label>
                  <div className="wallet-quick-amounts">
                    {ADD_AMOUNTS.map(amt => (
                      <button key={amt}
                        className={`quick-amt-btn ${selectedAmt === amt ? 'active' : ''}`}
                        onClick={() => { setSelectedAmt(amt); setCustomAmt('') }}
                        id={`quick-amt-${amt}`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <label className="wallet-add-label" style={{ marginTop: 16 }}>Or Enter Custom Amount</label>
                  <input
                    id="wallet-custom-amount"
                    type="number"
                    className="wallet-amount-input"
                    placeholder="Enter amount (₹)"
                    value={customAmt}
                    min={1}
                    max={100000}
                    onChange={e => { setCustomAmt(e.target.value); setSelectedAmt(null) }}
                  />

                  <button
                    className="wallet-cta-btn"
                    onClick={handleAdd}
                    disabled={!selectedAmt && !customAmt}
                    id="wallet-add-confirm-btn"
                  >
                    <Plus size={16} />
                    Add ₹{(parseFloat(customAmt) || selectedAmt || 0).toLocaleString('en-IN')} to Wallet
                  </button>
                  <p className="wallet-note">💡 Demo mode — money is added instantly</p>
                </>
              )}
            </motion.div>
          )}

          {/* History tab */}
          {tab === 'history' && (
            <motion.div key="history" className="wallet-tab-content"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
            >
              {transactions.length === 0 ? (
                <div className="wallet-empty">
                  <Wallet size={36} opacity={0.2} />
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="txn-full-list">
                  {transactions.map(txn => (
                    <div key={txn.id} className="txn-row">
                      <div className={`txn-icon ${txn.type}`}>
                        {txn.type === 'credit' ? <ArrowDown size={14}/> : <ArrowUp size={14}/>}
                      </div>
                      <div className="txn-info">
                        <span className="txn-desc">{txn.description}</span>
                        <span className="txn-date">
                          {new Date(txn.date).toLocaleDateString('en-IN')} •{' '}
                          {new Date(txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className={`txn-amount ${txn.type}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
