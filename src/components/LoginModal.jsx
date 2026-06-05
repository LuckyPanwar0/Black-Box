import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, ShieldCheck, ArrowRight, Loader2, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, fetchJson } from '../utils/api'
import './LoginModal.css'

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth()
  const [step, setStep] = useState('mobile') // mobile | otp
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (mobile.length < 10) return setError('Please enter valid 10-digit number')
    
    setError('')
    setIsLoading(true)
    
    try {
      const data = await fetchJson(`${API_BASE_URL}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      })

      if (data.success) {
        setStep('otp')
        setTimer(60)
      } else {
        setError(data.message || 'Unable to send OTP')
      }
    } catch (err) {
      setError(err.message || 'Connection failed. Is backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 4) return setError('Enter valid OTP')

    setError('')
    setIsLoading(true)

    try {
      const data = await fetchJson(`${API_BASE_URL}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      })

      login(data.user, data.token)
      onClose()
    } catch (err) {
      setError(err.data?.message || err.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div 
        className="login-modal"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <button className="login-close" onClick={onClose}><X size={20} /></button>

        <div className="login-header">
          <div className="login-logo">
            <ShieldCheck size={32} color="#FF2D55" />
          </div>
          <h2>{step === 'mobile' ? 'Welcome Back' : 'Verify OTP'}</h2>
          <p>{step === 'mobile' ? 'Enter mobile to continue' : `OTP sent to +91 ${mobile}`}</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={step === 'mobile' ? handleSendOtp : handleVerifyOtp}>
          {step === 'mobile' ? (
            <div className="login-input-group">
              <div className="input-prefix">+91</div>
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                maxLength={10}
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
              <Smartphone size={18} className="input-icon" />
            </div>
          ) : (
            <div className="login-input-group">
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="otp-input"
                autoFocus
              />
              <MessageSquare size={18} className="input-icon" />
            </div>
          )}

          <button className="login-submit-btn" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>{step === 'mobile' ? 'Send OTP' : 'Verify & Login'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {step === 'otp' && (
          <div className="otp-actions">
            <button type="button" onClick={() => setStep('mobile')}>Change Number</button>
            <button type="button" disabled={timer > 0} onClick={handleSendOtp}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
        )}

        <p className="login-footer">
          By continuing, you agree to our <a href="#">Terms</a> & <a href="#">Privacy</a>
        </p>
      </motion.div>
    </div>
  )
}
