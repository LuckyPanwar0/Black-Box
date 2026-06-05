import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { WalletProvider } from './context/WalletContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Products from './components/Products'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import ProductPage from './pages/ProductPage'
import PaymentResult from './pages/PaymentResult'
import AdminPage from './pages/AdminPage'
import './App.css'

import { AuthProvider } from './context/AuthContext'

function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Products />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </WalletProvider>
    </AuthProvider>
  )
}
