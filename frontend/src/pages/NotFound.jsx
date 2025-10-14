import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-900 mb-4">404</h1>
          <div className="w-24 h-1 bg-linear-to-r from-blue-600 to-green-600 mx-auto mb-8"></div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 bg-linear-to-r from-blue-600 to-green-600 text-white rounded-full hover:from-blue-700 hover:to-green-700 transition-all hover:scale-105 font-semibold"
          >
            <Home className="mr-2 w-5 h-5" />
            Ir al inicio
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all hover:scale-105 font-semibold"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Volver atrás
          </button>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500">
            ¿Necesitas ayuda? <a href="tel:5551234567" className="text-blue-600 hover:text-blue-800">Llámanos al (555) 123-4567</a>
          </p>
        </div>
      </div>
    </div>
  )
}
