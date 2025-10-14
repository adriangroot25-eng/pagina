import { FACILITY_CATEGORIES } from '../../../utils/constants'

const FacilityCard = ({ facility, index }) => {
  const category = FACILITY_CATEGORIES[facility.category]
  
  const categoryColorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500', 
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500'
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Imagen */}
      <div className="relative overflow-hidden">
        <img 
          src={facility.image}
          alt={facility.name}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Badge de categoría */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-semibold ${categoryColorClasses[category.color]}`}>
          {category.name}
        </div>
        
        {/* Contenido overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-xl font-bold mb-2">
            {facility.name}
          </h3>
          <p className="text-sm text-gray-200 leading-relaxed">
            {facility.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FacilityCard