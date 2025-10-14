import { Activity, Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FOOTER_LINKS, CONTACT_INFO, SOCIAL_LINKS } from '../../../utils/constants'
import { getCurrentYear, scrollToSection } from '../../../utils/helpers'

const Footer = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLinkClick = (href) => {
    if (href.startsWith('#')) {
      const sectionId = href.replace('#', '')
      
      // Si estamos en otra página que no sea HOME
      if (location.pathname !== '/') {
        // Navegar a HOME primero
        navigate('/')
        // Esperar más tiempo y usar scrollIntoView directamente
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
    }
    // Para enlaces externos, el Link de React Router los manejará
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
      scrollToSection('inicio')
    }
  }

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Logo y Descripción */}
          <div className="md:col-span-1">
            <button 
              onClick={handleLogoClick}
              className="flex items-center justify-center md:justify-start space-x-2 mb-6 hover:scale-105 transition-transform duration-300"
            >
              <Activity className="h-10 w-10 text-green-500" />
              <span className="text-4xl font-bold text-white font-brand">Sportiva</span>
            </button>
            <p className="text-gray-300 leading-relaxed mb-6">
              Tu centro de bienestar deportivo integral, comprometido con tu salud 
              y rendimiento atlético en Ciudad Apodaca, Nuevo León.
            </p>
            
            {/* Información de contacto rápida */}
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{CONTACT_INFO.address.city}</span>
              </div>
            </div>
          </div>
          
          {/* Servicios */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-green-400">Servicios</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((service) => (
                <li key={service.name}>
                  <button
                    onClick={() => handleLinkClick(service.href)}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Navegación */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-green-400">Navegación</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.navigation.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleLinkClick(item.href)}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal y Redes */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-green-400">Legal</h4>
            <ul className="space-y-3 mb-8">
              {FOOTER_LINKS.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                    onClick={() => {
                      // Espera a que la navegación ocurra y luego hace scroll al top
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }, 100)
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-xl font-bold mb-6 text-green-400">Síguenos</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a 
                href={SOCIAL_LINKS.facebook} 
                className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={SOCIAL_LINKS.instagram} 
                className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={SOCIAL_LINKS.youtube} 
                className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href={SOCIAL_LINKS.linkedin} 
                className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Línea divisoria y copyright */}
        <div className="mt-16 border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-center md:text-left">
              © {getCurrentYear()} Sportiva. Todos los derechos reservados. | Diseñado para tu bienestar deportivo
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Hecho con ❤️ en FIME</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer