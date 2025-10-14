import { Check } from 'lucide-react'

const FormStep = ({ 
  step, 
  title, 
  description, 
  isActive, 
  isCompleted, 
  isLastStep = false 
}) => {
  return (
    <div className="flex items-center">
      {/* Círculo del paso */}
      <div className={`
        relative flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg' 
          : isCompleted 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-400'
        }
      `}>
        {isCompleted ? (
          <Check className="w-6 h-6" />
        ) : (
          <span>{step}</span>
        )}
        
        {/* Efecto de pulso para paso activo */}
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 animate-ping opacity-25"></div>
        )}
      </div>

      {/* Información del paso */}
      <div className="ml-4 flex-1">
        <h3 className={`font-semibold transition-colors ${
          isActive ? 'text-blue-900' : isCompleted ? 'text-green-700' : 'text-gray-400'
        }`}>
          {title}
        </h3>
        <p className={`text-sm ${
          isActive ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {description}
        </p>
      </div>

      {/* Línea conectora */}
      {!isLastStep && (
        <div className={`h-px w-8 ml-4 transition-colors ${
          isCompleted ? 'bg-green-500' : 'bg-gray-300'
        }`} />
      )}
    </div>
  )
}

export default FormStep