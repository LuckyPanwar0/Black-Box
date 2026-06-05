import { useState } from 'react'
import { X, CreditCard, Smartphone, Building2, CheckCircle2, Loader2, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, authHeaders } from '../utils/api'
import './PaymentModal.css'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay with any UPI app' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit or Debit Card' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
]

export default function PaymentModal({ product, onClose }) {
  const { isAuthenticated } = useAuth()
  const [step, setStep] = useState('select') // select | processing | success
  const [method, setMethod] = useState('upi')
  const [upiType, setUpiType] = useState('app') // app | qr | id
  const [upiAppSelected, setUpiAppSelected] = useState('phonepe')
  const [formData, setFormData] = useState({ upiId: '', cardNo: '', expiry: '', cvv: '', name: '', bank: 'sbi', customerMobile: '' })
  const [errors, setErrors] = useState({})
  const [isApiCalling, setIsApiCalling] = useState(false)
  const [apiError, setApiError] = useState(null)

  const [gatewaySettings] = useState(() => {
    const stored = localStorage.getItem('bb_payment_settings')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        // ignore parse errors
      }
    }
    return {
      imbEnabled: true,
      imbToken: '525593ce8133d2ccfadf4b0ddc9d8aa5',
      merchantVpa: 'paytm.s1w0x7g@pty',
      merchantName: 'BlackBox',
      imbEnv: 'sandbox',
      imbUpiIntentMode: 'api'
    }
  })

  const validate = () => {
    const newErrors = {}
    if (method === 'upi') {
      if (gatewaySettings.imbEnabled) {
        if (!formData.customerMobile || formData.customerMobile.length < 10) {
          newErrors.customerMobile = 'Enter a valid 10-digit mobile number'
        }
      }
      if (upiType === 'id') {
        if (!formData.upiId || !formData.upiId.includes('@')) {
          newErrors.upiId = 'Enter valid UPI ID (e.g. name@upi)'
        }
      }
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

  const saveOrderLocal = (orderId, status = 'success') => {
    const orders = JSON.parse(localStorage.getItem('bb_orders') || '[]')
    orders.push({
      id: orderId,
      product: product.name,
      price: product.price,
      method: 'upi_imb',
      date: new Date().toISOString(),
      status
    })
    localStorage.setItem('bb_orders', JSON.stringify(orders))
  }

  const handleImbApiPay = async (orderId, upiUri) => {
    setIsApiCalling(true)
    setApiError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          amount: (product.price || 0).toString(),
          order_id: orderId,
          remark: product.name,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Payment creation failed')
      }

      let payUrl = data.gateway?.payment_url || data.gateway?.url
      if (!payUrl && data.gateway?.checkout_url) {
        payUrl = data.gateway.checkout_url
      }
      if (!payUrl && data.payment?.gateway_response) {
        try {
          const gatewayResponse = JSON.parse(data.payment.gateway_response)
          payUrl = gatewayResponse.payment_url || gatewayResponse.url
        } catch {
          // ignore parse errors
        }
      }

      if (payUrl) {
        saveOrderLocal(orderId, 'pending')
        window.location.href = payUrl
        return
      }

      throw new Error('Payment link not received from backend.')
    } catch (err) {
      console.error('Backend Call Error:', err)
      setApiError('Backend Error: ' + err.message + '. Falling back to local UPI Deep-link.')
      setTimeout(() => {
        saveOrderLocal(orderId, 'pending')
        window.location.href = upiUri
      }, 2500)
    } finally {
      setIsApiCalling(false)
    }
  }

  const handlePay = async () => {
    if (!validate()) return

    const orderId = 'BB' + Date.now()
    const vpa = gatewaySettings.merchantVpa || 'paytm.s1w0x7g@pty'
    const name = gatewaySettings.merchantName || 'BlackBox'
    const amount = product.price || 0
    const desc = product.name
    const upiUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&tr=${orderId}&am=${amount}&cu=INR&tn=${encodeURIComponent(desc)}`

    if (!isAuthenticated) {
      setApiError('Please log in before initiating payment.')
      return
    }

    if (gatewaySettings.imbEnabled) {
      if (upiType === 'qr') {
        setStep('processing')
        setApiError('Scan the QR code to pay. Verification is manual.')
        return
      }

      if (gatewaySettings.imbUpiIntentMode === 'api') {
        setStep('processing')
        await handleImbApiPay(orderId, upiUri)
      } else {
        // Direct intent flow - Opens UPI App
        // We cannot confirm success instantly here, so we show processing
        setStep('processing')
        window.location.href = upiUri
        // Keep it in processing as we don't know the status
        setApiError('Opening UPI App. Please complete payment there.')
      }
      return
    }

    // Demo/Fallthrough should not mark as success automatically for professional use
    setApiError('IMB Gateway not configured or Demo mode active.')
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
                <div className="upi-payment-container">
                  <div className="upi-type-tabs">
                    <button
                      type="button"
                      className={`upi-type-tab ${upiType === 'app' ? 'active' : ''}`}
                      onClick={() => setUpiType('app')}
                    >
                      UPI Apps
                    </button>
                    <button
                      type="button"
                      className={`upi-type-tab ${upiType === 'qr' ? 'active' : ''}`}
                      onClick={() => setUpiType('qr')}
                    >
                      QR Code
                    </button>
                    <button
                      type="button"
                      className={`upi-type-tab ${upiType === 'id' ? 'active' : ''}`}
                      onClick={() => setUpiType('id')}
                    >
                      UPI ID
                    </button>
                  </div>

                  {upiType === 'app' && (
                    <div className="upi-apps-section">
                      <p className="upi-section-help">Choose your UPI App. On mobile, this will open the app instantly.</p>
                      <div className="upi-apps-grid">
                        {[
                          { id: 'phonepe', label: 'PhonePe', color: '#5f259f', init: 'Pe' },
                          { id: 'gpay', label: 'GPay', color: '#4285F4', init: 'G' },
                          { id: 'paytm', label: 'Paytm', color: '#00baf2', init: 'Pm' },
                          { id: 'bhim', label: 'BHIM', color: '#e05320', init: 'Bh' },
                        ].map(app => (
                          <button
                            key={app.id}
                            type="button"
                            className={`upi-app-btn ${upiAppSelected === app.id ? 'active' : ''}`}
                            onClick={() => setUpiAppSelected(app.id)}
                          >
                            <div className="upi-app-icon-wrap" style={{ background: app.color }}>
                              {app.init}
                            </div>
                            <span>{app.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {upiType === 'qr' && (
                    <div className="upi-qr-section">
                      <p className="upi-section-help">Scan this QR Code with any UPI App to pay.</p>
                      <div className="upi-qr-container">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                            `upi://pay?pa=${gatewaySettings.merchantVpa || 'paytm.s1w0x7g@pty'}&pn=${encodeURIComponent(
                              gatewaySettings.merchantName || 'BlackBox'
                            )}&am=${product.price || 0}&cu=INR&tn=${encodeURIComponent(product.name)}`
                          )}`}
                          alt="UPI QR Code"
                          className="upi-qr-image"
                        />
                        <div className="upi-qr-labels">
                          <span className="upi-qr-vpa">{gatewaySettings.merchantVpa || 'paytm.s1w0x7g@pty'}</span>
                          <span className="upi-qr-merchant">{gatewaySettings.merchantName || 'BlackBox'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {upiType === 'id' && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="upi-input">UPI ID / VPA</label>
                      <input
                        id="upi-input"
                        type="text"
                        className={`form-input ${errors.upiId ? 'error' : ''}`}
                        placeholder="e.g. name@ybl or name@paytm"
                        value={formData.upiId}
                        onChange={e => setFormData(f => ({...f, upiId: e.target.value}))}
                      />
                      {errors.upiId && <span className="form-error">{errors.upiId}</span>}
                    </div>
                  )}

                  {gatewaySettings.imbEnabled && (
                    <div className="form-group" style={{ marginTop: 14 }}>
                      <label className="form-label" htmlFor="customer-mobile">Customer Mobile Number</label>
                      <input
                        id="customer-mobile"
                        type="text"
                        className={`form-input ${errors.customerMobile ? 'error' : ''}`}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        value={formData.customerMobile}
                        onChange={e => setFormData(f => ({...f, customerMobile: e.target.value.replace(/\D/g, '').slice(0, 10)}))}
                      />
                      {errors.customerMobile && <span className="form-error">{errors.customerMobile}</span>}
                    </div>
                  )}

                  {apiError && (
                    <div className="api-error-alert">
                      <span>⚠️ {apiError}</span>
                    </div>
                  )}
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
            <button className="pay-btn" onClick={handlePay} id="pay-now-btn" disabled={isApiCalling}>
              {isApiCalling ? (
                <span>Generating Payment URL...</span>
              ) : upiType === 'qr' && method === 'upi' ? (
                <span>Verify Payment</span>
              ) : product.price ? (
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
