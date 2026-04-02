import { createContext, useContext, useState, useEffect } from 'react'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('bb_wallet_balance')
    return saved ? parseFloat(saved) : 2500.00
  })
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('bb_wallet_txns') || '[]')
  })

  // Save to localStorage whenever balance/txns change
  useEffect(() => {
    localStorage.setItem('bb_wallet_balance', balance.toString())
  }, [balance])

  useEffect(() => {
    localStorage.setItem('bb_wallet_txns', JSON.stringify(transactions))
  }, [transactions])

  const addMoney = (amount, description = 'Added to wallet') => {
    const txn = {
      id: 'TXN' + Date.now(),
      type: 'credit',
      amount,
      description,
      date: new Date().toISOString(),
    }
    setBalance(b => parseFloat((b + amount).toFixed(2)))
    setTransactions(t => [txn, ...t].slice(0, 50))
    return txn
  }

  const deductMoney = (amount, description = 'Payment') => {
    if (balance < amount) return { success: false, error: 'Insufficient balance' }
    const txn = {
      id: 'TXN' + Date.now(),
      type: 'debit',
      amount,
      description,
      date: new Date().toISOString(),
    }
    setBalance(b => parseFloat((b - amount).toFixed(2)))
    setTransactions(t => [txn, ...t].slice(0, 50))
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
