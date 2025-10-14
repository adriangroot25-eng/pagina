import FacilityCard from './FacilityCard'
import { FACILITIES_DATA } from '../../../utils/constants'

const ImageGallery = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-auto">
      {/* Columna 1 */}
      <div className="space-y-6">
        {FACILITIES_DATA.filter((_, index) => index % 4 === 0).map((facility, index) => (
          <div 
            key={facility.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <FacilityCard facility={facility} index={index} />
          </div>
        ))}
      </div>
      
      {/* Columna 2 */}
      <div className="space-y-6">
        {FACILITIES_DATA.filter((_, index) => index % 4 === 1).map((facility, index) => (
          <div 
            key={facility.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index * 0.1) + 0.2}s` }}
          >
            <FacilityCard facility={facility} index={index} />
          </div>
        ))}
      </div>
      
      {/* Columna 3 (oculta en móvil) */}
      <div className="hidden md:block space-y-6">
        {FACILITIES_DATA.filter((_, index) => index % 4 === 2).map((facility, index) => (
          <div 
            key={facility.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index * 0.1) + 0.4}s` }}
          >
            <FacilityCard facility={facility} index={index} />
          </div>
        ))}
      </div>
      
      {/* Columna 4 (oculta en móvil) */}
      <div className="hidden md:block space-y-6">
        {FACILITIES_DATA.filter((_, index) => index % 4 === 3).map((facility, index) => (
          <div 
            key={facility.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index * 0.1) + 0.6}s` }}
          >
            <FacilityCard facility={facility} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery