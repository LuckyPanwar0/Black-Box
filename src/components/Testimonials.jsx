import { Star, Quote } from 'lucide-react'
import './Testimonials.css'

const TESTIMONIALS = [
  {
    name: 'Ramesh Kumar',
    role: 'Fleet Owner, Rajasthan',
    avatar: 'RK',
    text: 'BlackBuck has completely transformed how I manage my fleet of 12 trucks. The GPS tracking gives me peace of mind and FASTag has saved us hours at toll booths. Highly recommended!',
    rating: 5,
    product: 'BlackBuck GPS & FASTag',
    color: '#6A0DAD',
  },
  {
    name: 'Suresh Pillar',
    role: 'Independent Trucker, Maharashtra',
    avatar: 'SP',
    text: 'BlackBuck Loads app has given me a constant stream of verified freight orders. I no longer waste time at truck stops looking for loads. My income has increased by 40%!',
    rating: 5,
    product: 'BlackBuck Loads',
    color: '#FF2D55',
  },
  {
    name: 'Vikram Singh',
    role: 'Logistics Manager, Delhi',
    avatar: 'VS',
    text: 'The fuel card savings are incredible. We save nearly 2-3% on every fuel transaction across our entire fleet. The cashback system is transparent and credited instantly.',
    rating: 5,
    product: 'BlackBuck Fuel Cards',
    color: '#FF8C00',
  },
  {
    name: 'Praveen Reddy',
    role: 'Fleet Owner, Telangana',
    avatar: 'PR',
    text: 'Getting a loan for my second truck was a nightmare with banks. BlackBuck Loans approved my request within 48 hours with minimal paperwork. Truly life-changing!',
    rating: 5,
    product: 'BlackBuck Loans',
    color: '#00B4D8',
  },
  {
    name: 'Manoj Tiwari',
    role: 'Transporter, Uttar Pradesh',
    avatar: 'MT',
    text: 'I was skeptical about switching to digital, but BlackBuck made it seamless. The platform is in Hindi too which helps me and my drivers use it everyday without issues.',
    rating: 5,
    product: 'BlackBuck FASTag',
    color: '#00C896',
  },
  {
    name: 'Arun Sharma',
    role: 'Owner-Operator, Gujarat',
    avatar: 'AS',
    text: 'Customer support is excellent. Any issue gets resolved quickly. The monthly reports help me understand where I can optimize costs across fuel, toll, and maintenance.',
    rating: 4,
    product: 'BlackBuck GPS',
    color: '#8B5CF6',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Success Stories</span>
          <h2 className="section-title">
            What Does Our Customer
            <br /><span className="text-gradient">Say About Us</span>
          </h2>
        </motion.div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {/* Quote icon */}
              <div className="testimonial-quote">
                <Quote size={20} />
              </div>

              {/* Stars */}
              <div className="testimonial-stars">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} size={14}
                    fill={si < t.rating ? '#FF8C00' : 'none'}
                    color={si < t.rating ? '#FF8C00' : 'rgba(255,255,255,0.2)'}
                  />
                ))}
              </div>

              <p className="testimonial-text">"{t.text}"</p>

              <div className="testimonial-footer">
                <div className="testimonial-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                  {t.avatar}
                </div>
                <div className="testimonial-info">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-role">{t.role}</span>
                  <span className="testimonial-product" style={{ color: t.color }}>
                    {t.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          className="testimonials-stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { value: '4.8/5', label: 'Average Rating', icon: '⭐' },
            { value: '50,000+', label: 'Happy Customers', icon: '😊' },
            { value: '98%', label: 'Satisfaction Rate', icon: '✅' },
            { value: '24/7', label: 'Customer Support', icon: '🎧' },
          ].map(stat => (
            <div key={stat.label} className="ts-stat">
              <span className="ts-icon">{stat.icon}</span>
              <span className="ts-value">{stat.value}</span>
              <span className="ts-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
