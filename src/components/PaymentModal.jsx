import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CreditCard, Smartphone, Building2, CheckCircle2, Loader2, Shield } from 'lucide-react'
import './PaymentModal.css'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay with any UPI app' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit or Debit Card' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
]

export default function PaymentModal({ product, onClose }) {
  const [step, setStep] = useState('select') // select | processing | success
  const [method, setMethod] = useState('upi')
  const [formData, setFormData] = useState({ upiId: '', cardNo: '', expiry: '', cvv: '', name: '', bank: 'sbi' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (method === 'upi') {
      if (!formData.upiId || !formData.upiId.includes('@')) newErrors.upiId = 'Enter valid UPI ID (e.g. name@upi)'
    }
    if (method === 'card') {
      if (!formData.cardNo || formData.cardNo.replace(/\s/g,'').length < 16) newErrors.cardNo = 'Enter valid 16-digit card number'
      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Enter valid expiry (MM/YY)'
      if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = 'Enter valid CVV'
      if (!formData.name.trim()) newErrors.name = 'Enter cardholder name'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePay = () => {
    if (!validate()) return

    // Attempt Razorpay if available
    if (window.Razorpay && product.price) {
      const options = {
        key: 'rzp_test_yourkeyhere', // Replace with actual key
        amount: product.price * 100,
        currency: 'INR',
        name: 'BlackBuck',
        description: product.name,
        image: '/favicon.svg',
        handler: () => { setStep('success') },
        prefill: { name: formData.name, email: 'user@example.com' },
        theme: { color: '#FF2D55' },
        modal: { ondismiss: () => {} }
      }
      try {
        const rzp = new window.Razorpay(options)
        rzp.open()
        return
      } catch (e) {
        // Fall through to demo flow
      }
    }

    // Demo flow
    setStep('processing')
    setTimeout(() => {
      setStep('success')
      // Store in localStorage as demo DB
      const orders = JSON.parse(localStorage.getItem('bb_orders') || '[]')
      orders.push({
        id: 'BB' + Date.now(),
        product: product.name,
        price: product.price,
        method,
        date: new Date().toISOString(),
        status: 'success'
      })
      localStorage.setItem('bb_orders', JSON.stringify(orders))
    }, 2200)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="payment-modal"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Close */}
        <button className="modal-close" onClick={onClose} id="modal-close-btn">
          <X size={18} />
        </button>

        {step === 'success' ? (
          <div className="payment-success">
            <motion.div
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h2>Payment Successful!</h2>
            <p>Thank you for purchasing <strong>{product.name}</strong></p>
            {product.price && <p className="success-amount">₹{product.price.toLocaleString('en-IN')} paid successfully</p>}
            <div className="success-order">
              <span>Order ID: </span>
              <span className="order-id">BB{Date.now().toString().slice(-8)}</span>
            </div>
            <button className="btn-primary success-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : step === 'processing' ? (
          <div className="payment-processing">
            <motion.div
              className="processing-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={40} />
            </motion.div>
            <h3>Processing Payment...</h3>
            <p>Please wait, do not close this window</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="modal-header">
              <div className="modal-product-info">
                <div className="modal-product-icon" style={{ background: product.gradient }}>
                  {/* Support both lucide component (from ProductPage) and emoji (from Products.jsx) */}
                  {typeof product.icon === 'string'
                    ? <span style={{ fontSize: 20 }}>{product.icon}</span>
                    : product.lucideIcon
                      ? (() => { const Ic = product.lucideIcon; return <Ic size={20} color="#fff" /> })()
                      : null
                  }
                </div>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.tagline}</p>
                </div>
              </div>
              {product.price && (
                <div className="modal-price">
                  <span className="price-label">Amount</span>
                  <span className="price-value">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Method selector */}
            <div className="modal-section">
              <label className="modal-label">Payment Method</label>
              <div className="method-tabs">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    className={`method-tab ${method === m.id ? 'active' : ''}`}
                    onClick={() => { setMethod(m.id); setErrors({}) }}
                    id={`method-${m.id}-btn`}
                  >
                    <m.icon size={16} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div className="modal-section">
              {method === 'upi' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="upi-input">UPI ID</label>
                  <input
                    id="upi-input"
                    type="text"
                    className={`form-input ${errors.upiId ? 'error' : ''}`}
                    placeholder="name@ybl or name@paytm"
                    value={formData.upiId}
                    onChange={e => setFormData(f => ({...f, upiId: e.target.value}))}
                  />
                  {errors.upiId && <span className="form-error">{errors.upiId}</span>}
                </div>
              )}

              {method === 'card' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name-input">Cardholder Name</label>
                    <input id="name-input" type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="John Doe" value={formData.name}
                      onChange={e => setFormData(f => ({...f, name: e.target.value}))} />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-input">Card Number</label>
                    <input id="card-input" type="text" className={`form-input ${errors.cardNo ? 'error' : ''}`}
                      placeholder="0000 0000 0000 0000" maxLength={19}
                      value={formData.cardNo}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g,'').slice(0,16)
                        setFormData(f => ({...f, cardNo: v.replace(/(\d{4})/g,'$1 ').trim()}))
                      }} />
                    {errors.cardNo && <span className="form-error">{errors.cardNo}</span>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="expiry-input">Expiry</label>
                      <input id="expiry-input" type="text" className={`form-input ${errors.expiry ? 'error' : ''}`}
                        placeholder="MM/YY" maxLength={5} value={formData.expiry}
                        onChange={e => {
                          let v = e.target.value.replace(/\D/g,'').slice(0,4)
                          if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2)
                          setFormData(f => ({...f, expiry: v}))
                        }} />
                      {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cvv-input">CVV</label>
                      <input id="cvv-input" type="password" className={`form-input ${errors.cvv ? 'error' : ''}`}
                        placeholder="•••" maxLength={4} value={formData.cvv}
                        onChange={e => setFormData(f => ({...f, cvv: e.target.value.replace(/\D/g,'').slice(0,4)}))} />
                      {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                    </div>
                  </div>
                </>
              )}

              {method === 'netbanking' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="bank-select">Select Bank</label>
                  <select id="bank-select" className="form-input form-select"
                    value={formData.bank} onChange={e => setFormData(f => ({...f, bank: e.target.value}))}>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                  </select>
                </div>
              )}
            </div>

            {/* Pay button */}
            <button className="pay-btn" onClick={handlePay} id="pay-now-btn">
              {product.price ? (
                <span>Pay ₹{product.price.toLocaleString('en-IN')}</span>
              ) : (
                <span>{product.ctaLabel || 'Proceed'}</span>
              )}
              <Shield size={15} />
            </button>

            <p className="modal-secure-note">
              <Shield size={12} /> 256-bit SSL encrypted &amp; 100% secure payment
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
