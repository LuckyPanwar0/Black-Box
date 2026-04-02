import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { WalletProvider } from './context/WalletContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Products from './components/Products'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import ProductPage from './pages/ProductPage'
import './App.css'

// Home page layout
function HomePage({ adminOpen, setAdminOpen }) {
  return (
    <>
      <main>
        <Hero />
        <Products />
        <Testimonials />
      </main>
      <Footer />

      {/* Admin FAB */}
      <button
        className="admin-fab"
        onClick={() => setAdminOpen(true)}
        title="Admin Panel"
        id="admin-fab-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </button>

      <AnimatePresence>
        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<HomePage adminOpen={adminOpen} setAdminOpen={setAdminOpen} />}
            />
            <Route path="/product/:productId" element={<ProductPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </WalletProvider>
  )
}
