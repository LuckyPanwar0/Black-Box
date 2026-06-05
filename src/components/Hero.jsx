import { ArrowRight, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import './Hero.css'

export default function Hero() {
  const scrollToProducts = () => {
    const el = document.querySelector('#products')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="hero">
      {/* Background */}
      <div className="hero-bg">
        <img src="/hero-bg.png" alt="India Highway Aerial View" className="hero-img" />
        <div className="hero-overlay" />
        <div className="hero-vignette" />
      </div>

      {/* Animated particles */}
      <div className="hero-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`} />
        ))}
      </div>

      {/* Content */}
      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="badge-dot" />
          <span>Empowering Truck Operators Across India</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span className="hero-title-accent">INDIA'S LARGEST</span>
          <br />
          <span className="hero-title-main">DIGITAL TRUCKING</span>
          <br />
          <span className="hero-title-main">PLATFORM</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Seamlessly manage FASTags, GPS tracking, freight loads,
          <br className="hero-br" /> fuel cards, and loans — all in one platform
        </motion.p>

        <motion.div
          className="hero-cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <button className="hero-cta-primary" onClick={scrollToProducts} id="hero-explore-btn">
            <span>Explore</span>
            <ArrowRight size={18} />
          </button>

          <button className="hero-cta-secondary" id="hero-video-btn">
            <div className="play-icon">
              <Play size={14} />
            </div>
            <span>Watch Story</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {[
            { value: '1Cr+', label: 'Truck Operators' },
            { value: '12L+', label: 'Trucks Tracked' },
            { value: '₹5000Cr+', label: 'Saved Annually' },
            { value: '29+', label: 'States Covered' },
          ].map(stat => (
            <div key={stat.label} className="hero-stat">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="scroll-line" />
        <span>© 2024 BLACKBUCK</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  )
}
