import useIntersectionAnimation from '../hooks/useIntersection'
import Hero from '../components/sections/Hero/Hero'
import ServicesSection from '../components/sections/Services/ServicesSection'
import FacilitiesSection from '../components/sections/Facilities/FacilitiesSection'
import TeamSection from '../components/sections/Team/TeamSection'
import BlogSection from '../components/sections/Blog/BlogSection'
import WhatsAppFloat from '../components/common/UI/WhatsAppFloat'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  // Usar hook personalizado para animaciones de intersección
  useIntersectionAnimation()

  // Función para navegar a reservaciones
  const handleReservation = () => {
    navigate('/reservaciones')
  }

  return (
    <div>
      {/* Hero Section - usando el componente separado */}
      <Hero />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Facilities Section */}
      <FacilitiesSection />
      
      {/* Team Section */}
      <TeamSection />

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section - simplificada */}
      <section id="contacto" className="py-20 bg-white fade-in-section">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ color: "#1A1A40", textShadow: "0 2px 8px #e0e7ff" }}>
            Ponte en Contacto
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 mb-12">
              Estamos aquí para ayudarte en tu camino hacia el bienestar deportivo. 
              Visítanos o envíanos un mensaje.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Columna izquierda: Contacto + WhatsApp + Horarios + Redes */}
              <div className="p-8 bg-gradient-card rounded-2xl shadow-md card-hover border border-gray-100 flex flex-col justify-between h-full">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1A1A40" }}>
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 7.25 7 13 7 13s7-5.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  Información de Contacto
                </h3>
                <div className="space-y-5 text-left text-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/></svg>
                    <div>
                      <span className="font-semibold">Teléfono:</span>
                      <a href="tel:5551234567" className="ml-1 hover:text-green-700 transition"> (555) 123-4567</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" stroke="none"/><path d="M22 6l-10 7L2 6"/></svg>
                    <div>
                      <span className="font-semibold">Email:</span>
                      <a href="mailto:contacto@sportiva.com" className="ml-1 hover:text-green-700 transition">contacto@sportiva.com</a>
                    </div>
                  </div>
                </div>
                {/* Botón WhatsApp destacado */}
              <div className="mt-8 flex justify-start">
                  <a
                    href="https://wa.me/5215512345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 shadow transition"
                  >
                    {/* Logo WhatsApp igual que en el resto del sitio */}
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.647.87 5.097 2.348 7.093L4 29l7.184-2.312A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.917c-2.083 0-4.104-.604-5.81-1.74l-.415-.263-4.272 1.376 1.396-4.164-.27-.427A9.92 9.92 0 0 1 6.083 15c0-5.478 4.439-9.917 9.917-9.917S25.917 9.522 25.917 15 21.478 24.917 16 24.917zm5.417-7.25c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.474-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.457.13-.605.134-.134.298-.347.447-.52.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.075-.149-.67-1.615-.917-2.215-.242-.582-.487-.503-.67-.513l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.099 3.21 5.083 4.374.711.306 1.264.489 1.697.626.713.227 1.362.195 1.874.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                   Escríbenos por WhatsApp
                  </a>
                </div>
                {/* Horarios visuales */}
                <div className="mt-8 flex items-start gap-3">
                  <svg className="w-7 h-7 text-blue-500 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <div className="text-left space-y-1 text-base">
                    <div className="font-semibold text-gray-700">Horarios:</div>
                    <div className="flex flex-col gap-1">
                      <span>Lun - Vie: <span className="font-medium text-gray-600">8:00 AM - 6:00 PM</span></span>
                      <span>Sábados: <span className="font-medium text-gray-600">8:00 AM - 2:00 PM</span></span>
                    </div>
                  </div>
                </div>
                {/* Redes sociales */}
              <div className="mt-8">
  <span className="block font-bold text-gray-700 text-sm mb-2">Síguenos en redes</span>
  <div className="flex gap-4">
    <a
      href="#"
      className="hover:scale-110 transition"
      title="Facebook"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg className="w-7 h-7" fill="#1877F3" viewBox="0 0 24 24">
        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.696h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
      </svg>
    </a>
    <a
                    href="https://www.instagram.com/sportivajrz?igsh=MXJxOXhzbnVzc2gzcg=="
                      className="hover:scale-110 transition"
                       title="Instagram"
                        target="_blank"
                       rel="noopener noreferrer"
>
                         <svg className="w-7 h-7" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fd5"/>
        <stop offset="50%" stopColor="#ff543e"/>
        <stop offset="100%" stopColor="#c837ab"/>
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig)" />
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" fill="#fff"/>
  </svg>
</a>
                  </div>
                </div>
              </div>
              {/* Columna derecha: Ubicación + mapa + botón */}
              <div className="p-8 bg-gradient-card rounded-2xl shadow-md card-hover border border-gray-100 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-6" style={{ color: "#1A1A40" }}>Ubicación</h3>
                <div className="text-left space-y-2">
                  <p><strong>Dirección:</strong></p>
                  <p>Calle Guadalupe Victoria, Ávalos</p>
                  <p>31074 Chihuahua, Chih.</p>
                 {/* Mapa de Google */}
<div className="my-4 rounded-lg overflow-hidden shadow-lg">
  <iframe
    title="Ubicación Sportiva"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.034209614292!2d-106.0297287!3d28.5832221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ea43c7e6e6e6e7%3A0x7e7e7e7e7e7e7e7e!2sCalle%20Guadalupe%20Victoria%2C%20%C3%81valos%2C%2031074%20Chihuahua%2C%20Chih.!5e0!3m2!1ses-419!2smx!4v1715555555555!5m2!1ses-419!2smx"
    width="100%"
    height="220"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

{/* Botón Cómo llegar */}
<div className="flex justify-start mt-2">
  <a
    href="https://www.google.com/maps/dir/?api=1&destination=Calle+Guadalupe+Victoria,+Ávalos,+31074+Chihuahua,+Chih"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg px-4 py-2 transition"
  >
    Cómo llegar
  </a>
</div>

                </div>
              </div>
            </div>
            {/* Botón agendar consulta */}
            <div className="space-y-6">
              <button 
                onClick={handleReservation}
                className="btn-secondary px-8 py-4 text-white rounded-full font-semibold text-lg hover-scale"
              >
                Agendar Consulta Ahora
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* WhatsApp Component */}
      <WhatsAppFloat />
    </div>
  )
}