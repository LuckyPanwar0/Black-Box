import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, Star, Shield, Zap, Users, ChevronDown, ChevronUp,
  Tag, MapPin, Package, Fuel, Landmark, Smartphone, ArrowRight, Wallet
} from 'lucide-react'
import PaymentModal from '../components/PaymentModal'
import { useWallet } from '../context/WalletContext'
import './ProductPage.css'

export const PRODUCTS_DATA = {
  fastag: {
    id: 'fastag',
    name: 'BlackBuck FASTag',
    tagline: 'Seamless tolling for truckers',
    description:
      'BlackBuck FASTag is India\'s most trusted FASTag for truck operators. Recharge once, pay tolls automatically at all NPCI-enabled toll plazas across India. No more queues, no cash hassles.',
    price: 500,
    ctaLabel: 'Buy Now',
    gradient: 'linear-gradient(135deg, #6A0DAD 0%, #1A1A40 100%)',
    cardGradient: 'linear-gradient(160deg, rgba(106,13,173,0.25) 0%, rgba(26,26,64,0.5) 100%)',
    borderColor: 'rgba(106,13,173,0.4)',
    glowColor: 'rgba(106,13,173,0.35)',
    accentColor: '#8B5CF6',
    icon: Tag,
    image: '/fastag.png',
    rating: 4.8,
    reviews: 12430,
    features: [
      { title: '100% Cashless', desc: 'Automatic toll payment at all NPCI toll plazas nationwide' },
      { title: 'Instant Recharge', desc: 'Top-up via UPI, Net Banking, or any mobile wallet' },
      { title: 'Real-time Alerts', desc: 'SMS and app notifications for every toll deduction' },
      { title: 'All Vehicles', desc: 'Available for trucks, buses, and all commercial vehicles' },
      { title: 'Pan India Coverage', desc: 'Works at 900+ toll plazas across all states' },
      { title: 'Linked to Aadhaar', desc: 'Secure, verified, and government-backed FASTag' },
    ],
    specs: [
      { label: 'Price', value: '₹500 (one-time)' },
      { label: 'Validity', value: '5 years' },
      { label: 'Recharge Min', value: '₹100' },
      { label: 'Coverage', value: '900+ toll plazas' },
      { label: 'Bank Partner', value: 'ICICI Bank' },
    ],
    faqs: [
      { q: 'How long does FASTag installation take?', a: 'FASTag is delivered within 3–5 business days and installation takes less than 5 minutes.' },
      { q: 'Can I track my toll transactions?', a: 'Yes, all transactions are visible in the BlackBuck app in real-time.' },
      { q: 'What happens if my FASTag balance is low?', a: 'You receive an automatic SMS alert when balance falls below ₹200.' },
    ],
  },
  gps: {
    id: 'gps',
    name: 'BlackBuck GPS',
    tagline: 'Track your fleet in real-time',
    description:
      'BlackBuck GPS gives truck owners and fleet managers complete visibility of all their vehicles with live tracking, route analytics, driver behavior monitoring, and detailed performance reports.',
    price: 1499,
    ctaLabel: 'Buy Now',
    gradient: 'linear-gradient(135deg, #00C896 0%, #003B2F 100%)',
    cardGradient: 'linear-gradient(160deg, rgba(0,200,150,0.22) 0%, rgba(0,59,47,0.5) 100%)',
    borderColor: 'rgba(0,200,150,0.35)',
    glowColor: 'rgba(0,200,150,0.3)',
    accentColor: '#00C896',
    icon: MapPin,
    image: '/gps.png',
    rating: 4.7,
    reviews: 8920,
    features: [
      { title: 'Live Tracking', desc: 'Real-time GPS location updated every 30 seconds' },
      { title: 'Route History', desc: '90-day playback of complete route history' },
      { title: 'Driver Alerts', desc: 'Overspeed, harsh braking, and idling alerts' },
      { title: 'Geofencing', desc: 'Set custom zones and get entry/exit notifications' },
      { title: '4G Connected', desc: 'Always-on 4G SIM with India-wide coverage' },
      { title: 'Analytics Dashboard', desc: 'Fuel efficiency, mileage, and trip reports' },
    ],
    specs: [
      { label: 'Device Price', value: '₹1499' },
      { label: 'Monthly Plan', value: 'From ₹199/month' },
      { label: 'Network', value: '4G / 2G fallback' },
      { label: 'Battery Backup', value: '6 hours' },
      { label: 'Update Interval', value: 'Every 30 seconds' },
    ],
    faqs: [
      { q: 'How is the GPS device installed?', a: 'Our technician visits your location and installs in under 30 minutes.' },
      { q: 'Does it work in remote areas?', a: 'Yes, it has 4G with 2G fallback, covering 99% of India.' },
      { q: 'Can I track multiple trucks?', a: 'Yes, track unlimited vehicles from one app/dashboard.' },
    ],
  },
  loads: {
    id: 'loads',
    name: 'BlackBuck Loads',
    tagline: "India's largest truck load marketplace",
    description:
      "BlackBuck Loads is India's #1 digital freight marketplace. Connect directly with verified shippers, get competitive rates, and fill your truck on every trip — eliminating middlemen and maximizing your income.",
    price: null,
    ctaLabel: 'Subscribe Free',
    gradient: 'linear-gradient(135deg, #FF2D55 0%, #1A0010 100%)',
    cardGradient: 'linear-gradient(160deg, rgba(255,45,85,0.22) 0%, rgba(26,0,16,0.5) 100%)',
    borderColor: 'rgba(255,45,85,0.35)',
    glowColor: 'rgba(255,45,85,0.3)',
    accentColor: '#FF2D55',
    icon: Package,
    image: '/loads.png',
    rating: 4.6,
    reviews: 31200,
    features: [
      { title: '3.7 Lakh+ Loads', desc: 'Massive catalog across 700+ routes in India' },
      { title: 'Verified Shippers', desc: 'All shippers are KYC-verified for safety' },
      { title: 'No Middlemen', desc: 'Connect directly with shippers, earn more' },
      { title: 'Smart Matching', desc: 'AI matches your truck to the best available loads' },
      { title: 'Instant Booking', desc: 'Book a load in under 2 minutes on the app' },
      { title: 'Payment Guarantee', desc: 'Secured payments with money in 24–48 hours' },
    ],
    specs: [
      { label: 'Listed Loads', value: '3.7 Lakh+' },
      { label: 'Routes', value: '700+' },
      { label: 'Verified Shippers', value: '50,000+' },
      { label: 'Payment Time', value: '24–48 hours' },
      { label: 'Subscription', value: 'Free Basic plan' },
    ],
    faqs: [
      { q: 'Is registration free?', a: 'Yes, basic registration and load browsing is completely free.' },
      { q: 'How do I get paid?', a: 'Payment is transferred to your bank account within 24–48 hours of delivery.' },
      { q: 'Can I negotiate the rate?', a: 'Yes, you can communicate directly with the shipper and negotiate.' },
    ],
  },
  fuel: {
    id: 'fuel',
    name: 'BlackBuck Fuel Cards',
    tagline: 'Save on every litre of fuel',
    description:
      'BlackBuck Fuel Card is a prepaid smart card that gives truck operators exclusive fuel discounts, cashback rewards, and loyalty points at 7,000+ partner pumps across India. Save up to ₹3 per litre.',
    price: null,
    ctaLabel: 'Apply Now',
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #3A1F00 100%)',
    cardGradient: 'linear-gradient(160deg, rgba(255,140,0,0.22) 0%, rgba(58,31,0,0.5) 100%)',
    borderColor: 'rgba(255,140,0,0.35)',
    glowColor: 'rgba(255,140,0,0.3)',
    accentColor: '#FF8C00',
    icon: Fuel,
    image: '/fuel.png',
    rating: 4.5,
    reviews: 9870,
    features: [
      { title: 'Up to 3% Savings', desc: 'Earn cashback on every fuel transaction' },
      { title: '7000+ Pumps', desc: 'Accepted at HPCL, BPCL, Indian Oil & more' },
      { title: 'No Expiry', desc: 'Balance never expires, use anytime' },
      { title: 'Fleet Cards', desc: 'Issue separate cards for each driver' },
      { title: 'Loyalty Points', desc: 'Earn & redeem points for rewards' },
      { title: 'Digital Receipts', desc: 'Track all transactions in the app' },
    ],
    specs: [
      { label: 'Joining Fee', value: 'Free' },
      { label: 'Savings', value: 'Up to ₹3/litre' },
      { label: 'Partner Pumps', value: '7000+' },
      { label: 'Card Validity', value: '3 years' },
      { label: 'Min Load', value: '₹500' },
    ],
    faqs: [
      { q: 'How long does card issuance take?', a: 'The physical card is delivered in 5–7 business days.' },
      { q: 'Can I use it for personal vehicles?', a: 'No, it is exclusively for commercial vehicles.' },
      { q: 'How do I earn loyalty points?', a: 'You earn 1 point for every ₹10 spent on fuel.' },
    ],
  },
  loans: {
    id: 'loans',
    name: 'BlackBuck Loans',
    tagline: 'Technology-led vehicle finance',
    description:
      'BlackBuck Loans empowers truck operators to get quick, hassle-free vehicle finance with minimal documentation. Buy your next truck, expand your fleet, or refinance — all through the app in hours.',
    price: null,
    ctaLabel: 'Get Loan',
    gradient: 'linear-gradient(135deg, #00B4D8 0%, #001F2D 100%)',
    cardGradient: 'linear-gradient(160deg, rgba(0,180,216,0.22) 0%, rgba(0,31,45,0.5) 100%)',
    borderColor: 'rgba(0,180,216,0.35)',
    glowColor: 'rgba(0,180,216,0.3)',
    accentColor: '#00B4D8',
    icon: Landmark,
    image: '/loans.png',
    rating: 4.7,
    reviews: 5640,
    features: [
      { title: 'Simple Application', desc: 'Apply in minutes with minimal documents needed' },
      { title: '10X Faster', desc: 'Loan approved 10X faster than traditional banks' },
      { title: 'No Hidden Fees', desc: 'Transparent terms with zero hidden charges' },
      { title: 'Flexible EMI', desc: 'Customized EMI plans that suit your cash flow' },
      { title: 'High Loan Amount', desc: 'Get up to ₹50 Lakhs for truck purchase' },
      { title: 'Used Trucks OK', desc: 'Finance for both new and used commercial vehicles' },
    ],
    specs: [
      { label: 'Loan Amount', value: 'Up to ₹50 Lakhs' },
      { label: 'Interest Rate', value: 'Starting 9.5% p.a.' },
      { label: 'Tenure', value: '12–60 months' },
      { label: 'Processing Fee', value: '1% of loan amount' },
      { label: 'Approval Time', value: '24–48 hours' },
    ],
    faqs: [
      { q: 'What documents are required?', a: 'Aadhaar, PAN, 3 months bank statement, truck RC (if refinancing).' },
      { q: 'Can I apply with a low credit score?', a: 'Yes, we evaluate beyond CIBIL score using our proprietary model.' },
      { q: 'Is there a pre-closure penalty?', a: 'After 6 EMIs, pre-closure is free of any penalty.' },
    ],
  },
}

export default function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { balance, deductMoney } = useWallet()
  const [showPayment, setShowPayment] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [walletPay, setWalletPay] = useState(false)
  const [walletMsg, setWalletMsg] = useState(null)
  const [imgError, setImgError] = useState(false)

  const product = PRODUCTS_DATA[productId]
  if (!product) {
    return (
      <div className="pp-not-found">
        <h2>Product not found</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>← Go Home</button>
      </div>
    )
  }

  const Icon = product.icon

  const handleWalletPay = () => {
    if (!product.price) { setShowPayment(true); return }
    const result = deductMoney(product.price, `${product.name} purchase`)
    if (result.success) {
      setWalletMsg({ type: 'success', text: `✅ Payment of ₹${product.price} successful via Wallet!` })
      // Store order
      const orders = JSON.parse(localStorage.getItem('bb_orders') || '[]')
      orders.push({ id: 'BB' + Date.now(), product: product.name, price: product.price, method: 'wallet', date: new Date().toISOString(), status: 'success' })
      localStorage.setItem('bb_orders', JSON.stringify(orders))
    } else {
      setWalletMsg({ type: 'error', text: `❌ ${result.error}. Please add money to wallet.` })
    }
    setWalletPay(true)
    setTimeout(() => setWalletMsg(null), 4000)
  }

  return (
    <div className="product-page">
      {/* Header nav */}
      <div className="pp-nav">
        <div className="container">
          <button className="pp-back-btn" onClick={() => navigate('/')} id="pp-back-btn">
            <ArrowLeft size={18} /> Back to Home
          </button>
          <div className="pp-nav-right">
            <div className="pp-wallet-chip">
              <Wallet size={14} />
              <span>₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="pp-hero" style={{ background: product.cardGradient }}>
        <div className="pp-hero-glow" style={{ background: product.glowColor }} />
        <div className="container">
          <div className="pp-hero-inner">
            {/* Left content */}
            <motion.div
              className="pp-hero-content"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="pp-icon-badge" style={{ background: product.gradient }}>
                <Icon size={24} color="#fff" />
              </div>
              <h1 className="pp-title">{product.name}</h1>
              <p className="pp-tagline">{product.tagline}</p>

              {/* Rating */}
              <div className="pp-rating">
                <div className="pp-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15}
                      fill={i < Math.floor(product.rating) ? '#FF8C00' : 'none'}
                      color={i < Math.floor(product.rating) ? '#FF8C00' : 'rgba(255,255,255,0.2)'}
                    />
                  ))}
                </div>
                <span className="pp-rating-val">{product.rating}</span>
                <span className="pp-reviews">({product.reviews.toLocaleString('en-IN')} reviews)</span>
              </div>

              <p className="pp-description">{product.description}</p>

              {/* CTA buttons */}
              <div className="pp-cta-group">
                {product.price && (
                  <div className="pp-price-tag">
                    <span className="pp-price-label">Price</span>
                    <span className="pp-price-val">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <button
                  className="pp-cta-primary"
                  style={{ background: product.gradient }}
                  onClick={() => setShowPayment(true)}
                  id={`pp-cta-${product.id}`}
                >
                  {product.ctaLabel} <ArrowRight size={16} />
                </button>
                <button
                  className="pp-cta-wallet"
                  onClick={handleWalletPay}
                  id={`pp-wallet-pay-${product.id}`}
                >
                  <Wallet size={16} /> Pay via Wallet
                </button>
              </div>

              {/* Wallet message */}
              <AnimatePresence>
                {walletMsg && (
                  <motion.div
                    className={`pp-wallet-msg ${walletMsg.type}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {walletMsg.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right - Product Image */}
            <motion.div
              className="pp-hero-image"
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="pp-img-glow" style={{ background: product.glowColor }} />
              {!imgError ? (
                <img
                  src={product.image}
                  alt={`${product.name} app mockup`}
                  className="pp-product-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="pp-img-fallback" style={{ background: product.gradient }}>
                  <Icon size={64} color="rgba(255,255,255,0.6)" />
                </div>
              )}
              {/* Floating badges */}
              <motion.div className="pp-float-badge pp-float-1"
                animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <CheckCircle2 size={14} color="#00C896" />
                <span>Verified</span>
              </motion.div>
              <motion.div className="pp-float-badge pp-float-2"
                animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                <Shield size={14} color="#8B5CF6" />
                <span>Secure</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <section className="pp-features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Key Features</span>
            <h2 className="section-title" style={{ marginBottom: 40 }}>
              Why Choose <span className="text-gradient">{product.name}?</span>
            </h2>
          </motion.div>

          <div className="pp-features-grid">
            {product.features.map((f, i) => (
              <motion.div
                key={i}
                className="pp-feature-card"
                style={{ borderColor: product.borderColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="pp-feature-icon" style={{ background: product.gradient }}>
                  <CheckCircle2 size={16} color="#fff" />
                </div>
                <h4 className="pp-feature-title" style={{ color: product.accentColor }}>{f.title}</h4>
                <p className="pp-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs + Image side by side */}
      <section className="pp-specs-section">
        <div className="container">
          <div className="pp-specs-inner">
            {/* Specs table */}
            <motion.div
              className="pp-specs-card"
              style={{ borderColor: product.borderColor, background: product.cardGradient }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="pp-specs-title">
                <Zap size={18} style={{ color: product.accentColor }} /> Product Specifications
              </h3>
              <div className="pp-specs-list">
                {product.specs.map((spec, i) => (
                  <div key={i} className="pp-spec-row">
                    <span className="pp-spec-label">{spec.label}</span>
                    <span className="pp-spec-value" style={{ color: product.accentColor }}>{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="pp-trust-bar">
                <div className="pp-trust-item">
                  <Users size={16} color={product.accentColor} />
                  <span>{product.reviews.toLocaleString('en-IN')}+ users</span>
                </div>
                <div className="pp-trust-item">
                  <Shield size={16} color={product.accentColor} />
                  <span>100% Secure</span>
                </div>
                <div className="pp-trust-item">
                  <Star size={16} color="#FF8C00" fill="#FF8C00" />
                  <span>{product.rating} Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Large product image */}
            <motion.div
              className="pp-large-img-wrap"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="pp-large-img-glow" style={{ background: product.glowColor }} />
              {!imgError ? (
                <img
                  src={product.image}
                  alt={`${product.name} overview`}
                  className="pp-large-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="pp-large-img-fallback" style={{ background: product.gradient }}>
                  <Icon size={80} color="rgba(255,255,255,0.4)" />
                  <p>{product.name}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="pp-faq-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">FAQ</span>
            <h2 className="section-title" style={{ marginBottom: 32 }}>Frequently Asked Questions</h2>
          </motion.div>

          <div className="pp-faqs">
            {product.faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="pp-faq-item"
                style={{ borderColor: openFaq === i ? product.borderColor : 'rgba(255,255,255,0.07)' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <button
                  className="pp-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  id={`faq-${product.id}-${i}`}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      className="pp-faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom sticky CTA */}
      <div className="pp-sticky-cta" style={{ borderColor: product.borderColor }}>
        <div className="container">
          <div className="pp-sticky-inner">
            <div>
              <span className="pp-sticky-name">{product.name}</span>
              {product.price && <span className="pp-sticky-price">₹{product.price.toLocaleString('en-IN')}</span>}
            </div>
            <div className="pp-sticky-btns">
              <button className="pp-sticky-btn-wallet" onClick={handleWalletPay} id="pp-sticky-wallet-btn">
                <Wallet size={15} /> Wallet Pay
              </button>
              <button
                className="pp-sticky-btn-primary"
                style={{ background: product.gradient }}
                onClick={() => setShowPayment(true)}
                id="pp-sticky-cta-btn"
              >
                {product.ctaLabel} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && (
          <PaymentModal product={product} onClose={() => setShowPayment(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
