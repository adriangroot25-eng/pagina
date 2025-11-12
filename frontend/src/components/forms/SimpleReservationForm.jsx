import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react'
import { WHATSAPP_CONFIG, createAppointmentMessage } from '../../config/whatsapp'

const CONSULTA_WEBHOOK_URL = 'https://n8n-7tlv.onrender.com/webhook/ab674d49-2204-46ff-89fe-f963c8e95c59'

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
  const [availableSlots, setAvailableSlots] = useState([]); // Horas disponibles reales
  const [isLoadingSlots, setIsLoadingSlots] = useState(false); // Estado de carga


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

  const fetchAvailableSlots = async (fecha, servicio) => {
    // Reinicia la lista de horas
    setAvailableSlots([]);
    if (!fecha || !servicio) {
      setIsLoadingSlots(false);
      return;
    }
    setIsLoadingSlots(true);

    setIsLoadingSlots(true);

    try {
      // Llama al webhook de consulta (usando GET)
      const response = await fetch(
        // Envía la fecha y el servicio como parámetros en la URL
        `${CONSULTA_WEBHOOK_URL}?fecha=${fecha}&tipo_servicio=${encodeURIComponent(servicio)}`,
        { method: 'GET' }
      );

      // --- INICIO DEBUG ---
      console.log('Respuesta del Webhook:', response); // Imprime el objeto Response completo
      const responseText = await response.text(); // Lee la respuesta como TEXTO
      console.log('Texto de la Respuesta:', responseText); // Imprime el texto crudo
        // --- FIN DEBUG ---

      if (response.ok) {
            try {
                // Intenta convertir el texto a JSON
                const data = JSON.parse(responseText); 
                console.log('Datos JSON parseados:', data); // Imprime el objeto JSON
                
                // Asegúrate de que n8n devuelve un array directamente o un objeto con la propiedad
                // Si n8n devuelve { horas_disponibles: [...] } -> usa data.horas_disponibles
                // Si n8n devuelve [...] directamente -> usa data
                const slots = Array.isArray(data) ? data : (data.horas_disponibles || []);
                console.log('Horas a establecer:', slots); // Imprime la lista final
                
                setAvailableSlots(slots); 
            } catch (jsonError) {
                console.error('Error al parsear JSON:', jsonError);
                alert("La respuesta del servidor no es válida.");
            }
        } else {
            console.error("Error al consultar disponibilidad:", response.status, responseText);
            alert("No pudimos consultar los horarios. Intenta de nuevo.");
        }
    } catch (error) {
        console.error("Fallo la conexión con el servicio de consulta:", error);
        alert("Error de conexión al buscar horarios.");
    } finally {
        setIsLoadingSlots(false);
    }
    };
    // --- FIN FUNCIÓN CONSULTA N8N ---

    // --- useEffect que ACTIVA la consulta ---
    useEffect(() => {
      // Resetea la hora si el servicio o la fecha cambian
      setFormData(prev => ({ ...prev, hora: '' }));
      // La consulta se ejecuta cuando la fecha Y el paquete están seleccionados
      if (formData.fecha && selectedPackage?.name) {
        fetchAvailableSlots(formData.fecha, selectedPackage.name);
      }
    }, [formData.fecha, selectedPackage?.name]); // El efecto se dispara cuando estos valores cambian

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

    // NUEVO CÓDIGO PARA LLAMAR AL WEBHOOK DE N8N
    const datosFormulario = {
      nombre: formData.nombre,
      telefono: `+521${formData.telefono.replace(/\s/g, '')}`, // <-- CORRECTO
      email: formData.email,
      tipo_servicio: selectedPackage.name,
      fecha: formData.fecha, // Formato AAAA-MM-DD
      hora: formData.hora, // Formato HH:MM
      motivo: formData.motivo,
      precio: selectedPackage.price,
      duracion: selectedPackage.duration
    };

    // Webhook n8n
    const webhookURL = 'https://n8n-7tlv.onrender.com/webhook/72fb2396-522e-4ae7-888b-2d995d54a564'; 

    try {
    const respuesta = await fetch(webhookURL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(datosFormulario), // Envía los datos del formulario
    });

    if (respuesta.ok) {
    // Si n8n recibe los datos bien, SÍ mostramos el éxito
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ // Limpia el formulario
          nombre: '',
          telefono: '',
          email: '',
          fecha: '',
          hora: '',
          motivo: ''
        }); 
        onBack(); // Vuelve a la selección de paquetes
      }, 2000);
    }, 500);

    } else {
      // Si n8n da un error
      alert('Hubo un problema al registrar tu cita. Intenta de nuevo.');
      setIsSubmitting(false); // Detiene la animación de carga
  }

  } catch (error) {
    // Si hay un error de red (ej. no hay internet)
    console.error('Error al contactar el servidor:', error);
    alert('Error de conexión. No se pudo registrar la cita.');
    setIsSubmitting(false); // Detiene la animación de carga
  }
  // FIN DEL NUEVO CÓDIGO

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
            ¡Cita Registrada!
          </h2>
          <p className="text-gray-600 mb-4">
            ¡Tu cita ha sido registrada! Revisa tu WhatsApp para la confirmación.
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
              // Deshabilita la selección mientras carga
              disabled={isLoadingSlots || !formData.fecha}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                {isLoadingSlots
                  ? 'Cargando Horarios...'
                  : !formData.fecha
                  ? 'Selecciona la fecha primero'
                  : availableSlots.length === 0
                  ? 'No hay horarios disponibles'
                  : 'Selecciona una hora'
                  }
                  </option>
              {availableSlots.map((slot) => (
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
