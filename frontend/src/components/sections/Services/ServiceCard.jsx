import { SERVICE_COLORS } from '../../../utils/constants';

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  delay = '0s' 
}) => {
  return (
    <div 
      className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100"
      style={{ animationDelay: delay }}
    >
      {/* Icono */}
      <div 
        className={`bg-gradient-to-r ${SERVICE_COLORS[color]} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300 animate-bounce-in`}
        style={{ animationDelay: delay }}
      >
        <Icon className="text-white w-12 h-12" />
      </div>
      
      {/* Contenido */}
      <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;