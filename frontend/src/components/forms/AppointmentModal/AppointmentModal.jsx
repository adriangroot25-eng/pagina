import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Calendar from './Calendar'
import SpecialistList from './SpecialistList'

export default function AppointmentModal({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
          <X className="w-8 h-8" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Agenda tu cita</h2>
          <p className="text-xl text-gray-600">Selecciona una fecha y especialista disponible</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-6">Selecciona una fecha</h3>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-6">Especialistas disponibles</h3>
            <div className="max-h-96 overflow-y-auto">
              <SpecialistList selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
