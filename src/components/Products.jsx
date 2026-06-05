import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight, ExternalLink, Tag, MapPin, Package, Fuel, Landmark } from 'lucide-react'
import PaymentModal from './PaymentModal'
import './Products.css'

const PRODUCTS = [
  {
    id: 'fastag',
    name: 'BlackBuck FASTag',
    tagline: 'Seamless tolling for truckers',
    price: 500,
    ctaLabel: 'Buy Now',
    gradient: 'linear-gradient(135deg, #6A0DAD, #1A1A40)',
    cardGradient: 'linear-gradient(160deg, rgba(106,13,173,0.18) 0%, rgba(26,26,64,0.35) 100%)',
    borderColor: 'rgba(106,13,173,0.35)',
    glowColor: 'rgba(106,13,173,0.25)',
    accentColor: '#8B5CF6',
    icon: '🏷️',
    lucideIcon: Tag,
    image: '/fastag.png',
    features: [
      '100% cashless payment at all NPCI toll plazas',
      'Instant top-up via UPI, Net Banking',
      'Available for all truck vehicles',
    ],
  },
  {
    id: 'gps',
    name: 'BlackBuck GPS',
    tagline: 'Tracking made easy',
    price: 1499,
    ctaLabel: 'Buy Now',
    gradient: 'linear-gradient(135deg, #00C896, #003B2F)',
    cardGradient: 'linear-gradient(160deg, rgba(0,200,150,0.15) 0%, rgba(0,59,47,0.35) 100%)',
    borderColor: 'rgba(0,200,150,0.25)',
    glowColor: 'rgba(0,200,150,0.2)',
    accentColor: '#00C896',
    icon: '📍',
    lucideIcon: MapPin,
    image: '/gps.png',
    features: [
      'Real-time GPS tracking across India',
      'Advanced analytics & reports',
      'Trusted by thousands of BlackBuck fleets',
    ],
  },
  {
    id: 'loads',
    name: 'BlackBuck Loads',
    tagline: "Largest digital marketplace for loads in India",
    price: null,
    ctaLabel: 'Subscribe',
    gradient: 'linear-gradient(135deg, #FF2D55, #1A0010)',
    cardGradient: 'linear-gradient(160deg, rgba(255,45,85,0.15) 0%, rgba(26,0,16,0.35) 100%)',
    borderColor: 'rgba(255,45,85,0.25)',
    glowColor: 'rgba(255,45,85,0.2)',
    accentColor: '#FF2D55',
    icon: '📦',
    lucideIcon: Package,
    image: '/loads.png',
    features: [
      '3.7L+ loads listed in more than 700 routes',
      'Get verified loads from shipper partners',
      'Complete more trips, maximize earning potential',
    ],
  },
  {
    id: 'fuel',
    name: 'BlackBuck Fuel Cards',
    tagline: 'Save money and time',
    price: null,
    ctaLabel: 'Apply Now',
    gradient: 'linear-gradient(135deg, #FF8C00, #3A1F00)',
    cardGradient: 'linear-gradient(160deg, rgba(255,140,0,0.15) 0%, rgba(58,31,0,0.35) 100%)',
    borderColor: 'rgba(255,140,0,0.25)',
    glowColor: 'rgba(255,140,0,0.2)',
    accentColor: '#FF8C00',
    icon: '⛽',
    lucideIcon: Fuel,
    image: '/fuel.png',
    features: [
      'Fuel savings up to 3% via loyalty points',
      'Accepted at 7000+ fuel stations across India',
      'Automatic cashbacks and rewards on spends',
    ],
  },
  {
    id: 'loans',
    name: 'BlackBuck Loans',
    tagline: 'Technology-led vehicle finance platform',
    price: null,
    ctaLabel: 'Get Loan',
    gradient: 'linear-gradient(135deg, #00B4D8, #001F2D)',
    cardGradient: 'linear-gradient(160deg, rgba(0,180,216,0.15) 0%, rgba(0,31,45,0.35) 100%)',
    borderColor: 'rgba(0,180,216,0.25)',
    glowColor: 'rgba(0,180,216,0.2)',
    accentColor: '#00B4D8',
    icon: '🏦',
    lucideIcon: Landmark,
    image: '/loans.png',
    features: [
      'Simple & hassle-free application process',
      'Approve 10X times faster processing requirement',
      'Non-disruptive cash flow for growth & capacity',
    ],
  },
]

const cardVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' }
  })
}

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <section id="products" className="products-section">
      <div className="container">
        {/* Section header */}
        <motion.div
          className="products-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Our Products</span>
          <h2 className="section-title">
            Empowering Truck Operators<br />
            <span className="text-gradient">to Manage & Grow</span>
          </h2>
          <p className="products-desc">
            Everything a trucker needs, on one digital platform
          </p>
        </motion.div>

        {/* Product cards */}
        <div className="products-list">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onCTA={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {/* Payment modal */}
      <AnimatePresence>
        {selectedProduct && (
          <PaymentModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function ProductCard({ product, index, onCTA }) {
  const Icon = product.lucideIcon
  const navigate = useNavigate()

  return (
    <motion.div
      className="product-card"
      style={{
        background: product.cardGradient,
        borderColor: product.borderColor,
      }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      {/* Glow effect */}
      <div className="card-glow" style={{ background: product.glowColor }} />

      {/* Left - Phone mockup */}
      <div className="card-image-wrap">
        <div className="phone-mockup-container">
          <div className="phone-glow" style={{ background: product.glowColor }} />
          <img
            src={product.image}
            alt={`${product.name} app mockup`}
            className="phone-mockup-img"
            loading="lazy"
          />
        </div>
      </div>

      {/* Right - Content */}
      <div className="card-content">
        <div className="card-icon-wrap" style={{ background: product.gradient }}>
          <Icon size={20} color="#fff" />
        </div>

        <h3 className="card-title">{product.name}</h3>
        <p className="card-tagline">{product.tagline}</p>

        {/* Features */}
        <ul className="card-features">
          {product.features.map((f, fi) => (
            <li key={fi} className="card-feature-item">
              <CheckCircle2 size={16} color={product.accentColor} style={{ flexShrink: 0 }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="card-cta-row">
          {product.price && (
            <span className="card-price">
              <span className="price-currency">₹</span>
              {product.price.toLocaleString('en-IN')}
            </span>
          )}
          <button
            className="card-cta-btn"
            style={{
              background: product.gradient,
              boxShadow: `0 4px 24px ${product.glowColor}`
            }}
            onClick={onCTA}
            id={`cta-${product.id}`}
          >
            {product.ctaLabel}
            <ArrowRight size={16} />
          </button>
          <button
            className="card-details-btn"
            onClick={() => navigate(`/product/${product.id}`)}
            id={`details-${product.id}`}
          >
            View Details <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
