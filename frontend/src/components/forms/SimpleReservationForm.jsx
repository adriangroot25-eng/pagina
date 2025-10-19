import { useState } from 'react'
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react'
import { WHATSAPP_CONFIG, createAppointmentMessage } from '../../config/whatsapp'

const SimpleReservationForm = ({ selectedPackage, onBack }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fecha: '',
    hora: '',
    motivo: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Generar horarios disponibles (8:00 AM - 6:00 PM, cada 30 min)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Validar formulario
  const validateForm = () => {
    if (!formData.nombre.trim()) return 'Por favor ingresa tu nombre completo'
    if (!formData.telefono.trim()) return 'Por favor ingresa tu teléfono'
    if (!formData.email.trim()) return 'Por favor ingresa tu correo electrónico'
    if (!formData.fecha) return 'Por favor selecciona una fecha'
    if (!formData.hora) return 'Por favor selecciona una hora'

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return 'Por favor ingresa un correo válido'

    // Validar formato de teléfono (10 dígitos)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.telefono.replace(/\s/g, ''))) {
      return 'Por favor ingresa un teléfono válido de 10 dígitos'
    }

    return null
  }

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Enviar por WhatsApp
  const handleSubmit = async (e) => {
    e.preventDefault()

    const error = validateForm()
    if (error) {
      alert(error)
      return
    }

    setIsSubmitting(true)

    // Preparar mensaje para WhatsApp usando la plantilla
    const mensaje = createAppointmentMessage({
      nombre: formData.nombre,
      telefono: formData.telefono,
      email: formData.email,
      paquete: selectedPackage.name,
      precio: selectedPackage.price,
      duracion: selectedPackage.duration,
      fecha: formatDate(formData.fecha),
      hora: formData.hora,
      motivo: formData.motivo
    })

    // URL de WhatsApp usando la configuración
    const whatsappURL = `https://wa.me/${WHATSAPP_CONFIG.clinicNumber}?text=${encodeURIComponent(mensaje)}`

    // Abrir WhatsApp inmediatamente
    window.open(whatsappURL, '_blank')

    // Mostrar mensaje de éxito
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false)
        onBack()
      }, 2000)
    }, 500)
  }

  // Si ya se envió, mostrar mensaje de éxito
  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Solicitud Enviada!
          </h2>
          <p className="text-gray-600 mb-4">
            Se ha abierto WhatsApp con tu información.
          </p>
          <p className="text-sm text-gray-500">
            Envía el mensaje para confirmar tu cita con nuestro equipo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Cambiar paquete
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Agenda tu Cita
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="font-semibold text-blue-900">{selectedPackage.name}</p>
          <p className="text-sm text-blue-700">${selectedPackage.price} • {selectedPackage.duration}</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4" />
            Nombre Completo *
          </label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Juan Pérez García"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Teléfono y Email */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Teléfono *
            </label>
            <input
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="5512345678"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Fecha de la Cita *
            </label>
            <input
              type="date"
              required
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Hora de la Cita *
            </label>
            <select
              required
              value={formData.hora}
              onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una hora</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Motivo (Opcional) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4" />
            Motivo de Consulta (Opcional)
          </label>
          <textarea
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            placeholder="Describe brevemente el motivo de tu consulta..."
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Procesando...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Agendar Cita
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Al agendar tu cita, se abrirá WhatsApp para confirmar la reservación con nuestro equipo.
        </p>
      </form>
    </div>
  )
}

export default SimpleReservationForm
