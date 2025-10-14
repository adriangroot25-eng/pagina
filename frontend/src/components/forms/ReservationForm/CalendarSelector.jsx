import { useState, useEffect } from 'react'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import { getHorariosDisponibles } from '../../../utils/supabaseClient'

const CalendarSelector = ({ especialistaId, onSelectDateTime, selectedDate, selectedTime }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [availableHours, setAvailableHours] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Generar fechas disponibles para el mes actual (simulado)
  useEffect(() => {
    const generateDates = () => {
      const today = new Date()
      const dates = []
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      
      // Generar fechas para el mes actual
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i)
        
        // Solo incluir fechas futuras y días laborables (lunes a viernes)
        if (date >= today && date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push(date)
        }
      }
      
      setAvailableDates(dates)
    }
    
    generateDates()
  }, [currentMonth])

  // Cargar horarios disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate && especialistaId) {
      const fetchAvailableHours = async () => {
        setLoading(true)
        setError(null)
        
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0]
          const horarios = await getHorariosDisponibles(especialistaId, formattedDate)
          
          setAvailableHours(horarios.map(h => ({
            id: h.id,
            hora: h.hora,
            formattedHour: formatHour(h.hora)
          })))
        } catch (err) {
          console.error('Error al cargar horarios:', err)
          setError('No se pudieron cargar los horarios disponibles')
          
          // Horarios de respaldo en caso de error
          setAvailableHours([
            { id: 1, hora: '09:00:00', formattedHour: '9:00 AM' },
            { id: 2, hora: '10:00:00', formattedHour: '10:00 AM' },
            { id: 3, hora: '11:00:00', formattedHour: '11:00 AM' },
            { id: 4, hora: '12:00:00', formattedHour: '12:00 PM' },
            { id: 5, hora: '13:00:00', formattedHour: '1:00 PM' },
            { id: 6, hora: '16:00:00', formattedHour: '4:00 PM' },
            { id: 7, hora: '17:00:00', formattedHour: '5:00 PM' }
          ])
        } finally {
          setLoading(false)
        }
      }
      
      fetchAvailableHours()
    } else {
      setAvailableHours([])
    }
  }, [selectedDate, especialistaId])

  // Cambiar al mes anterior
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Cambiar al mes siguiente
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Formatear hora para mostrar
  const formatHour = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }

  // Verificar si una fecha es la seleccionada
  const isSelectedDate = (date) => {
    return selectedDate && 
      date.getDate() === selectedDate.getDate() && 
      date.getMonth() === selectedDate.getMonth() && 
      date.getFullYear() === selectedDate.getFullYear()
  }

  // Manejar selección de fecha
  const handleSelectDate = (date) => {
    onSelectDateTime(date, null)
  }

  // Manejar selección de hora
  const handleSelectHour = (hour) => {
    onSelectDateTime(selectedDate, hour.hora)
  }

  return (
    <div className="space-y-6">
      {/* Selector de fecha */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-50 p-4 flex justify-between items-center">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <h3 className="text-lg font-semibold text-blue-900">
            {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
          </h3>
          
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            <div className="text-xs font-medium text-gray-500">Lun</div>
            <div className="text-xs font-medium text-gray-500">Mar</div>
            <div className="text-xs font-medium text-gray-500">Mié</div>
            <div className="text-xs font-medium text-gray-500">Jue</div>
            <div className="text-xs font-medium text-gray-500">Vie</div>
            <div className="text-xs font-medium text-gray-500">Sáb</div>
            <div className="text-xs font-medium text-gray-500">Dom</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Espacios vacíos para alinear el primer día del mes */}
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() || 7 }).map((_, index) => (
              <div key={`empty-${index}`} className="h-10"></div>
            ))}
            
            {/* Días del mes */}
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, index) => {
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index + 1)
              const isAvailable = availableDates.some(d => 
                d.getDate() === date.getDate() && 
                d.getMonth() === date.getMonth() && 
                d.getFullYear() === date.getFullYear()
              )
              
              return (
                <button
                  key={`day-${index}`}
                  onClick={() => isAvailable && handleSelectDate(date)}
                  disabled={!isAvailable}
                  className={`h-10 rounded-full flex items-center justify-center text-sm transition-colors ${
                    isSelectedDate(date)
                      ? 'bg-blue-600 text-white'
                      : isAvailable
                        ? 'hover:bg-blue-100 text-blue-800'
                        : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Selector de hora */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              {formatDate(selectedDate)}
            </h3>
          </div>
          
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Horarios disponibles
            </h4>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            ) : availableHours.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No hay horarios disponibles para esta fecha
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableHours.map(hour => (
                  <button
                    key={hour.id}
                    onClick={() => handleSelectHour(hour)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedTime === hour.hora
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                    }`}
                  >
                    {hour.formattedHour}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarSelector