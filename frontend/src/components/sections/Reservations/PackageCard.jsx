import { Check, Clock, Star } from 'lucide-react'

const PackageCard = ({ package: pkg, isSelected, onSelect, isCustomizable = false }) => {
  const colorVariants = {
    blue: 'from-blue-500 to-blue-600 border-blue-200',
    orange: 'from-orange-500 to-orange-600 border-orange-200',
    green: 'from-green-500 to-green-600 border-green-200', 
    purple: 'from-purple-500 to-purple-600 border-purple-200',
    gradient: 'from-blue-500 via-purple-500 to-green-500 border-purple-200'
  }

  const getPrice = () => {
    if (pkg.customizable) {
      return 'Desde $900'
    }
    return `$${pkg.price}`
  }

  return (
    <div 
      className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 cursor-pointer group h-full flex flex-col ${
        isSelected 
          ? 'ring-4 ring-green-500 scale-105 shadow-2xl' 
          : 'hover:shadow-2xl hover:-translate-y-2'
      }`}
      onClick={() => onSelect(pkg)}
    >
      {/* Header con gradiente - altura fija */}
      <div className={`h-32 bg-gradient-to-r ${colorVariants[pkg.color]} relative flex-shrink-0`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 left-6 right-6 flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{pkg.name}</h3>
            <div className="flex items-center text-white/90">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{pkg.duration}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white leading-none">{getPrice()}</div>
            {!pkg.customizable && <div className="text-white/80 text-sm">MXN</div>}
          </div>
        </div>
        
        {/* Badge de selección */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
            <Check className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Contenido - flex grow para altura consistente */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Descripción */}
        <p className="text-gray-600 mb-6 leading-relaxed flex-shrink-0">
          {pkg.description}
        </p>

        {/* Ideal para */}
        <div className="mb-6 flex-shrink-0">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Ideal para:
          </h4>
          <p className="text-sm text-gray-600">{pkg.ideal_for}</p>
        </div>

        {/* Incluye - flex grow para ocupar espacio disponible */}
        <div className="mb-6 flex-1">
          <h4 className="font-semibold text-blue-900 mb-3">Incluye:</h4>
          <ul className="space-y-2">
            {pkg.includes.map((item, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing personalizado */}
        {pkg.customizable && pkg.pricing && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex-shrink-0">
            <h4 className="font-semibold text-blue-900 mb-3">Opciones disponibles:</h4>
            <div className="space-y-2">
              {Object.entries(pkg.pricing).map(([count, data]) => (
                <div key={count} className="flex justify-between text-sm">
                  <span>{count} especialidades</span>
                  <span className="font-semibold text-green-600">
                    ${data.price} <span className="text-xs text-gray-500">(Ahorro: ${data.discount})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de selección - siempre al fondo */}
        <div className="flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(pkg)
            }}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
              isSelected
                ? 'bg-green-500 text-white shadow-lg'
                : `bg-gradient-to-r ${colorVariants[pkg.color].split(' ')[0]} ${colorVariants[pkg.color].split(' ')[1]} text-white hover:shadow-lg hover:scale-105`
            }`}
          >
            {isSelected ? 'Paquete Seleccionado' : 'Seleccionar Paquete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PackageCard