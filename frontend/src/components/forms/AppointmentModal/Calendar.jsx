import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Calendar({ selectedDate, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const handleDateClick = (day) => {
    const date = new Date(year, month, day)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    if (date >= todayDate) {
      onDateSelect(date)
    }
  }
  
  const isDateSelected = (day) => {
    if (!selectedDate) return false
    const date = new Date(year, month, day)
    return date.toDateString() === selectedDate.toDateString()
  }
  
  const isPastDate = (day) => {
    const date = new Date(year, month, day)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    return date < todayDate
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-3 rounded-full hover:bg-gray-200">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h3 className="text-2xl font-bold text-blue-900">{monthNames[month]} {year}</h3>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-3 rounded-full hover:bg-gray-200">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map(day => <div key={day} className="font-bold text-sm text-gray-500 py-3 text-center">{day}</div>)}
        {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const isPast = isPastDate(day)
          const isSelected = isDateSelected(day)
          
          return (
            <button key={day} onClick={() => handleDateClick(day)} disabled={isPast} 
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center text-sm font-medium
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-100'}
                ${isSelected ? 'bg-blue-600 text-white shadow-lg' : ''}`}>
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
