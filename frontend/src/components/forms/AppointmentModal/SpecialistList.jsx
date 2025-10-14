import { Calendar, Phone, Clock } from 'lucide-react'

export default function SpecialistList({ selectedDate }) {
  const specialists = [
    { id: 1, name: 'Dr. Alex Turner', specialty: 'Médico del Deporte', phone: '5551234567' },
    { id: 2, name: 'Dra. Maya Singh', specialty: 'Fisioterapeuta', phone: '5551234567' },
    { id: 3, name: 'Lic. Ben Carter', specialty: 'Psicólogo Deportivo', phone: '5551234567' },
    { id: 4, name: 'Lic. Sofia Rossi', specialty: 'Nutrióloga', phone: '5551234567' }
  ]

  if (!selectedDate) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">Selecciona un día para ver los horarios disponibles.</p>
      </div>
    )
  }

  const formatDate = (date) => date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const handleAppointmentRequest = (specialist) => {
    const message = `Hola, me interesa agendar una cita con ${specialist.name} (${specialist.specialty}) para el ${formatDate(selectedDate)}.`
    const whatsappUrl = `https://wa.me/52${specialist.phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-green-50 rounded-lg border">
        <Calendar className="w-4 h-4 inline mr-2" />
        <strong>{formatDate(selectedDate)}</strong>
      </div>

      {specialists.map(specialist => (
        <div key={specialist.id} className="p-6 border rounded-xl bg-white hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-blue-900 text-lg">{specialist.name}</h4>
              <p className="text-sm text-gray-500">{specialist.specialty}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a href={`tel:${specialist.phone}`} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
              <Phone className="w-4 h-4 mr-2" />Llamar
            </a>
            <button onClick={() => handleAppointmentRequest(specialist)} className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
              WhatsApp
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
