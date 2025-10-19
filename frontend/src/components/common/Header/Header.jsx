import { useState, useEffect } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NAVIGATION_ITEMS } from '../../../utils/constants'
import { scrollToSection } from '../../../utils/helpers'
import logo from '../../../assets/logo.png'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleNavigation = (sectionId) => {
    // Si estamos en la página de reservaciones u otra página que no sea HOME
    if (location.pathname !== '/') {
      // Navegar a HOME primero
      navigate('/')
      // Esperar a que la navegación complete y luego hacer scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    } else {
      // Si ya estamos en HOME, solo hacer scroll
      scrollToSection(sectionId)
    }
    closeMenu()
  }

  const handleLogoClick = () => {
    // Si estamos en otra página, navegar a HOME
    if (location.pathname !== '/') {
      navigate('/')
      // Hacer scroll al top después de navegar
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
    } else {
      // Si ya estamos en HOME, solo scroll al top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleAppointment = () => {
    // Navegar a la página de reservaciones
    navigate('/reservaciones')
    closeMenu()
  }

  // Componente para enlaces de navegación
  const NavLink = ({ item, isMobile = false }) => (
    <button
      onClick={() => handleNavigation(item.id)}
      className={`
        transition-all duration-300 relative group
        ${isMobile 
          ? 'block w-full text-left px-6 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50' 
          : 'text-gray-700 hover:text-green-600 font-medium nav-underline'
        }
      `}
    >
      {item.label}
    </button>
  )

  // Menú de usuario con opción de login
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleUserMenu = () => setShowUserMenu((v) => !v);
  const closeUserMenu = () => setShowUserMenu(false);
  const UserMenu = () => (
    <div className="relative">
      <button
        onClick={handleUserMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 border-2 border-white shadow-lg text-white transition"
        aria-label="Usuario"
      >
        <User className="w-6 h-6" />
      </button>
      {showUserMenu && (
        <div className="absolute right-0 mt-3 w-48 bg-white border border-green-200 rounded-xl shadow-2xl z-50">
          <button
            onClick={() => { closeUserMenu(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-5 py-4 text-green-700 hover:bg-green-50 font-semibold rounded-xl transition text-lg"
          >
            <User className="w-5 h-5" />
            Iniciar sesión
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header
      className={`fixed w-full z-50 top-0 sticky-header ${
        isScrolled
          ? 'header-scrolled'
          : 'bg-white/90 backdrop-blur-lg'
      } shadow-lg`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
        >
          <img
            src={logo}
            alt="Sportiva Logo"
            className="max-h-16 w-auto object-contain"
            style={{ maxWidth: '180px' }}
          />
        </button>

        <div className="hidden lg:flex items-center w-full justify-between">
          {/* Opciones de menú centradas */}
          <ul className="flex items-center space-x-8 mx-auto">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.id}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
          {/* Botón Agendar Cita a la derecha del menú, separado del icono usuario */}
          <div className="flex items-center gap-8">
            <button 
              onClick={handleAppointment}
              className="px-6 py-3 btn-primary text-white rounded-full font-semibold shadow-lg"
            >
              Agendar Cita
            </button>
            {/* Ícono de usuario en la esquina derecha */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-blue-900 hover:text-green-600 transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t animate-fade-in-up">
          <ul className="flex flex-col py-4">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.id}>
                <NavLink item={item} isMobile={true} />
              </li>
            ))}
          </ul>
          <div className="px-6 pb-4 flex flex-col gap-2">
            <button 
              onClick={handleAppointment}
              className="w-full px-6 py-3 btn-primary text-white rounded-full font-semibold shadow-lg"
            >
              Agendar Cita
            </button>
            <button
              onClick={() => { closeMenu(); navigate('/login'); }}
              className="w-full flex items-center gap-2 px-6 py-3 text-blue-700 bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500 rounded-lg font-semibold"
            >
              <User className="w-5 h-5" />
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header