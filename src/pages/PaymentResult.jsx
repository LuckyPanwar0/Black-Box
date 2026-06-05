import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { API_BASE_URL, authHeaders, fetchJson } from '../utils/api'
import './ProductPage.css'

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('pending')
  const [message, setMessage] = useState('Verifying your payment...')
  const [error, setError] = useState(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const order_id = searchParams.get('order_id') || searchParams.get('order')
      const result = searchParams.get('status') || 'unknown'
      if (!order_id) {
        setStatus('failed')
        setError('Missing order ID in redirect URL')
        setMessage('Unable to complete payment verification.')
        return
      }

      try {
        const data = await fetchJson(`${API_BASE_URL}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
          },
          body: JSON.stringify({
            order_id,
            status: result === 'success' ? 'success' : 'failed',
            transaction_id: searchParams.get('transaction_id') || '',
          }),
        })
        setStatus(data.payment.status)
        setMessage(data.payment.status === 'success' ? 'Payment verified successfully.' : 'Payment failed or was cancelled.' )
      } catch (err) {
        setStatus('failed')
        setError(err.data?.message || err.message || 'Verification failed')
        setMessage('We could not verify the payment. Please contact support.')
      }
    }
    verifyPayment()
  }, [searchParams])

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">
        {status === 'pending' ? (
          <div className="result-status">
            <Loader2 className="spin-icon" />
            <h2>Verifying payment...</h2>
            <p>{message}</p>
          </div>
        ) : status === 'success' ? (
          <div className="result-status success">
            <CheckCircle2 size={54} />
            <h2>Payment Successful</h2>
            <p>{message}</p>
          </div>
        ) : (
          <div className="result-status failed">
            <XCircle size={54} />
            <h2>Payment Failed</h2>
            <p>{message}</p>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}

        <div className="result-actions">
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  )
}
