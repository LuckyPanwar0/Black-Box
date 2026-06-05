import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Wallet } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import WalletModal from './WalletModal'
import logo from '../assets/logo.png'
import './Navbar.css'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  {
    label: 'Company', href: '#company', dropdown: [
      { label: 'About Us', href: '#about' },
      { label: 'Leadership', href: '#leadership' },
      { label: 'Careers', href: '#careers' },
    ]
  },
  { label: 'Investor Relations', href: '#investors' },
  { label: 'Blogs & News', href: '#blogs' },
  { label: 'Contact Us', href: '#contact' },
]

import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [walletOpen, setWalletOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  
  const { balance } = useWallet()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    // if on product page, navigate home first
    if (!href.startsWith('#')) { window.location.href = href; return }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.location.href = '/' + href
  }

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="navbar-inner">
          {/* Left links */}
          <nav className="nav-links left">
            {navLinks.slice(0, 2).map(link => (
              <NavItem key={link.label} link={link} onNavigate={handleNavClick}
                activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />
            ))}
          </nav>

          {/* Logo */}
          <a href="/" className="navbar-logo">
            <img src={logo} alt="BlackBuck" className="logo-img" />
          </a>

          {/* Right links */}
          <nav className="nav-links right">
            {navLinks.slice(2).map(link => (
              <NavItem key={link.label} link={link} onNavigate={handleNavClick}
                activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />
            ))}
          </nav>

          <div className="navbar-actions">
            {/* Wallet button */}
            <button
              className="navbar-wallet-btn"
              onClick={() => setWalletOpen(true)}
              id="navbar-wallet-btn"
            >
              <Wallet size={15} />
              <span className="wallet-btn-label">Wallet</span>
              <span className="wallet-btn-balance">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="nav-profile-group">
                <button className="nav-logout-btn" onClick={logout}>Logout</button>
                <div className="nav-user-badge">
                  {user.name.split(' ')[0]}
                </div>
              </div>
            ) : (
              <button className="nav-login-btn" onClick={() => setLoginOpen(true)}>
                Login
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map(link => (
                <button key={link.label} className="mobile-link" onClick={() => handleNavClick(link.href)}>
                  {link.label}
                </button>
              ))}
              {/* Wallet in mobile */}
              <button className="mobile-wallet-btn" onClick={() => { setMobileOpen(false); setWalletOpen(true) }}
                id="mobile-wallet-btn">
                <Wallet size={16} />
                <span>My Wallet — ₹{balance.toLocaleString('en-IN')}</span>
              </button>

              {/* Login in mobile */}
              {!isAuthenticated ? (
                <button className="mobile-login-btn" onClick={() => { setMobileOpen(false); setLoginOpen(true) }}>
                  Login / Signup
                </button>
              ) : (
                <button className="mobile-logout-btn" onClick={() => { setMobileOpen(false); logout() }}>
                  Logout ({user.mobile})
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Wallet modal */}
      <AnimatePresence>
        {walletOpen && <WalletModal onClose={() => setWalletOpen(false)} />}
      </AnimatePresence>

      {/* Login modal */}
      <AnimatePresence>
        {loginOpen && <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

function NavItem({ link, onNavigate, activeDropdown, setActiveDropdown }) {
  const hasDropdown = link.dropdown && link.dropdown.length > 0

  return (
    <div
      className="nav-item"
      onMouseEnter={() => hasDropdown && setActiveDropdown(link.label)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button className="nav-link" onClick={() => onNavigate(link.href)}>
        {link.label}
        {hasDropdown && <ChevronDown size={14} style={{
          transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease'
        }} />}
      </button>

      <AnimatePresence>
        {hasDropdown && activeDropdown === link.label && (
          <motion.div
            className="dropdown"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            {link.dropdown.map(item => (
              <button key={item.label} className="dropdown-item" onClick={() => onNavigate(item.href)}>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
