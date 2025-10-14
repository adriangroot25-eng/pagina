import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import Header from './components/common/Header/Header'
import Footer from './components/common/Footer/Footer'
import Home from './pages/Home'
import BlogDetail from './pages/BlogDetail'
import Reservations from './pages/Reservations'
import PrivacyNotice from './pages/PrivacyNotice'
import TermsAndConditions from './pages/TermsAndConditions'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/reservaciones" element={<Reservations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacidad" element={<PrivacyNotice />} />
            <Route path="/terminos" element={<TermsAndConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}