import { motion } from 'framer-motion'
import { Twitter, Linkedin, Youtube, Instagram, Facebook, ArrowRight, Smartphone } from 'lucide-react'
import './Footer.css'

const FOOTER_LINKS = {
  'Products': ['BlackBuck FASTag', 'BlackBuck GPS', 'BlackBuck Loads', 'Fuel Cards', 'BlackBuck Loans'],
  'Company': ['About Us', 'Leadership', 'Careers', 'Press', 'Blog'],
  'Support': ['Help Center', 'Contact Us', 'Report a Bug', 'Community'],
  'Legal': ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'],
}

const SOCIALS = [
  { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com/blackbuck' },
  { Icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/blackbuck' },
  { Icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
]

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-glow" />

      <div className="container">
        {/* Top CTA */}
        <motion.div
          className="footer-cta-bar"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="footer-cta-text">
            <h3>Download the BlackBuck App</h3>
            <p>Manage your entire trucking business from your smartphone</p>
          </div>
          <div className="footer-app-btns">
            <a href="#" className="app-store-btn" id="playstore-btn">
              <div className="app-store-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3.18 23.5C2.63 23.2 2.25 22.6 2.25 21.85V2.15C2.25 1.4 2.63 0.8 3.18 0.5L13.5 12L3.18 23.5Z" fill="white"/>
                  <path d="M17.5 15.85L4.8 22.95L13.5 12L17.5 15.85Z" fill="white" opacity="0.6"/>
                  <path d="M17.5 8.15L13.5 12L4.8 1.05L17.5 8.15Z" fill="white" opacity="0.8"/>
                  <path d="M17.5 8.15L21 9.95C21.85 10.4 21.85 13.6 21 14.05L17.5 15.85L13.5 12L17.5 8.15Z" fill="white"/>
                </svg>
              </div>
              <div className="app-store-text">
                <span className="app-store-sub">GET IT ON</span>
                <span className="app-store-main">Google Play</span>
              </div>
            </a>
            <a href="#" className="app-store-btn app-store-btn-outline" id="appstore-btn">
              <Smartphone size={22} />
              <div className="app-store-text">
                <span className="app-store-sub">DOWNLOAD ON THE</span>
                <span className="app-store-main">App Store</span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Main footer grid */}
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="24" height="17" viewBox="0 0 28 20" fill="none">
                  <path d="M2 10 Q8 2 14 5 Q20 8 26 2" stroke="#FF2D55" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span>BLACKBUCK</span>
            </a>
            <p className="footer-brand-desc">
              India's largest digital trucking platform empowering over 1 crore truck operators with technology to grow their business.
            </p>
            <div className="footer-socials">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a key={label} href={href} className="social-link" aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="footer-links-col">
              <h4 className="footer-col-title">{category}</h4>
              <ul className="footer-links-list">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="footer-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <div className="newsletter-text">
            <h4>Stay in the Loop</h4>
            <p>Get updates on new features, offers and industry news</p>
          </div>
          <div className="newsletter-input-wrap">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
              id="newsletter-input"
            />
            <button className="newsletter-btn" id="newsletter-subscribe-btn">
              Subscribe <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">© 2024 BlackBuck. All rights reserved.</p>
          <nav className="footer-bottom-nav">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
            <a href="#">Investor Relations</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
