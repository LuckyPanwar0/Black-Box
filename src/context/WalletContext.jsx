import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { API_BASE_URL, authHeaders, fetchJson } from '../utils/api'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const { isAuthenticated, token } = useAuth()
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('bb_wallet_balance')
    return saved ? parseFloat(saved) : 2500.0
  })
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('bb_wallet_txns') || '[]')
  })

  useEffect(() => {
    localStorage.setItem('bb_wallet_balance', balance.toString())
  }, [balance])

  useEffect(() => {
    localStorage.setItem('bb_wallet_txns', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (!isAuthenticated) return
    const loadWallet = async () => {
      try {
        const data = await fetchJson(`${API_BASE_URL}/api/wallet`, {
          headers: { ...authHeaders() },
        })
        setBalance(data.wallet.balance)
        setTransactions(data.wallet.transactions)
      } catch (err) {
        console.warn('Unable to sync wallet', err.message)
      }
    }
    loadWallet()
  }, [isAuthenticated, token])

  const addMoney = async (amount, description = 'Added to wallet') => {
    if (isAuthenticated) {
      try {
        const data = await fetchJson(`${API_BASE_URL}/api/wallet/credit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ amount, reference: `wallet-credit-${Date.now()}`, description }),
        })
        setBalance(data.wallet.balance)
        return { success: true }
      } catch (err) {
        return { success: false, error: err.data?.message || err.message }
      }
    }
    const txn = {
      id: 'TXN' + Date.now(),
      type: 'credit',
      amount,
      description,
      date: new Date().toISOString(),
    }
    setBalance((b) => parseFloat((b + amount).toFixed(2)))
    setTransactions((t) => [txn, ...t].slice(0, 50))
    return { success: true, txn }
  }

  const deductMoney = async (amount, description = 'Payment') => {
    if (isAuthenticated) {
      try {
        const data = await fetchJson(`${API_BASE_URL}/api/wallet/debit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ amount, reference: `wallet-debit-${Date.now()}`, description }),
        })
        setBalance(data.wallet.balance)
        return { success: true }
      } catch (err) {
        return { success: false, error: err.data?.message || err.message }
      }
    }
    if (balance < amount) return { success: false, error: 'Insufficient balance' }
    const txn = {
      id: 'TXN' + Date.now(),
      type: 'debit',
      amount,
      description,
      date: new Date().toISOString(),
    }
    setBalance((b) => parseFloat((b - amount).toFixed(2)))
    setTransactions((t) => [txn, ...t].slice(0, 50))
    return { success: true, txn }
  }

  return (
    <WalletContext.Provider value={{ balance, transactions, addMoney, deductMoney }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}
