import DoctorCard from './DoctorCard'
import { MEDICAL_TEAM } from '../../../utils/constants'

const TeamSection = () => {
  return (
    <section id="nosotros" className="py-20 bg-white fade-in-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-blue-900 mb-6">
            Somos el único centro en el estado de Nuevo León con médicos especialistas certificados
          </h2>
          <p className="text-xl max-w-5xl mx-auto text-gray-600 font-light leading-relaxed">
            Sportiva es un centro integral deportivo con especialistas en medicina del deporte, 
            fisioterapia, nutrición y psicología deportiva. Todos nuestros expertos tienen experiencia 
            comprobada en deporte profesional y de alto rendimiento.
          </p>
        </div>
        
        {/* Grid de doctores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {MEDICAL_TEAM.map((doctor, index) => (
            <DoctorCard 
              key={doctor.id} 
              doctor={doctor} 
              index={index} 
            />
          ))}
        </div>
        
        {/* Sección de certificaciones */}
        <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">
              Certificaciones y Reconocimientos
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestro equipo cuenta con las más altas certificaciones nacionales e internacionales
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-gray-50 rounded-2xl card-hover">
              <div className="text-3xl font-bold text-blue-900 mb-2">100%</div>
              <p className="text-gray-600 font-medium">Certificado</p>
              <p className="text-sm text-gray-500">Equipo especializado</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl card-hover">
              <div className="text-3xl font-bold text-green-600 mb-2">45+</div>
              <p className="text-gray-600 font-medium">Años</p>
              <p className="text-sm text-gray-500">Experiencia combinada</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl card-hover">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <p className="text-gray-600 font-medium">Atletas</p>
              <p className="text-sm text-gray-500">Atendidos anualmente</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl card-hover">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <p className="text-gray-600 font-medium">Certificaciones</p>
              <p className="text-sm text-gray-500">Internacionales</p>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-3xl border border-gray-100">
            <h4 className="text-2xl font-bold text-blue-900 mb-4">
              ¿Listo para recibir atención especializada?
            </h4>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de especialistas está listo para ayudarte a alcanzar tus objetivos 
              deportivos y de salud con un enfoque personalizado.
            </p>
            <button className="btn-primary px-8 py-4 text-white rounded-full font-semibold text-lg hover-scale shadow-lg">
              Agendar Primera Consulta
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamSection