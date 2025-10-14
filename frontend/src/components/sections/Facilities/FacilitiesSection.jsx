import ImageGallery from './ImageGallery'

const FacilitiesSection = () => {
  return (
    <section id="instalaciones" className="py-20 bg-gray-50 fade-in-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-900 mb-6">
            Conoce Nuestras Instalaciones
          </h2>
          <p className="text-xl max-w-4xl mx-auto text-gray-600 font-light leading-relaxed">
            Descubre nuestras modernas instalaciones equipadas con la última tecnología 
            médica y deportiva para brindarte la mejor experiencia de atención especializada.
          </p>
        </div>
        
        <ImageGallery />
        
        {/* Sección adicional con estadísticas */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-lg card-hover">
            <div className="text-3xl font-bold text-blue-900 mb-2">500m²</div>
            <p className="text-gray-600">Área Total</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg card-hover">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <p className="text-gray-600">Áreas Especializadas</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg card-hover">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <p className="text-gray-600">Seguridad</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg card-hover">
            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
            <p className="text-gray-600">Equipamiento Moderno</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilitiesSection