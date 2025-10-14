import { MEDICAL_TEAM } from '../../../utils/constants'

export default function TeamSection() {

  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-blue-900 mb-6">Nuestro Equipo Médico Certificado</h2>
          <p className="text-xl max-w-5xl mx-auto text-gray-600 font-light">
            Todos nuestros especialistas cuentan con experiencia comprobada en deporte profesional y de alto rendimiento.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MEDICAL_TEAM.map((member, index) => (
            <div key={member.id} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="relative mb-6">
                <img src={member.image} alt={member.name} className="w-48 h-48 rounded-full mx-auto object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border">
                  <span className="text-xs font-semibold text-gray-600">{member.credentials.length}+ certificaciones</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2 group-hover:text-green-600 transition-colors">{member.name}</h3>
              <p className="text-blue-600 font-semibold text-lg mb-3">{member.specialty}</p>
              <p className="text-gray-600 leading-relaxed text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
