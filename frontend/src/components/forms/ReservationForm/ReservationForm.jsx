import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, User, Calendar, CreditCard, CheckCircle, AlertCircle, UserCheck } from 'lucide-react'
import FormStep from './FormStep'
import CalendarSelector from './CalendarSelector'
import { MEXICAN_STATES, GENDER_OPTIONS, PAYMENT_METHODS } from '../../../utils/constants'
import { getEspecialistas, crearPaciente, crearCita } from '../../../utils/supabaseClient'
import { enviarConfirmacionCita } from '../../../utils/notificationService'
import { programarRecordatorios } from '../../../utils/reminderService'

const ReservationForm = ({ selectedPackage, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [especialistas, setEspecialistas] = useState([])
  const [loadingEspecialistas, setLoadingEspecialistas] = useState(false)
  const [selectedEspecialista, setSelectedEspecialista] = useState(null)
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    // Dirección
    direccion: '',
    ciudad: '',
    estado: 'Nuevo León',
    codigo_postal: '',
    // Cita
    fecha_cita: '',
    hora_cita: '',
    motivo_consulta: '',
    sintomas_previos: '',
    primera_cita: true,
    // Pago
    metodo_pago: '',
    // Especialista y paquete
    especialista_id: '',
    paquete_id: selectedPackage?.id || '',
    // Paquete personalizado
    especialidades_seleccionadas: []
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar especialistas relacionados con el paquete seleccionado
  useEffect(() => {
    if (selectedPackage?.id) {
      const fetchEspecialistas = async () => {
        setLoadingEspecialistas(true)
        try {
          const data = await getEspecialistas(selectedPackage.id)
          setEspecialistas(data)
        } catch (error) {
          console.error("Error al cargar especialistas:", error)
        } finally {
          setLoadingEspecialistas(false)
        }
      }
      
      fetchEspecialistas()
    }
  }, [selectedPackage])

  const steps = [
    {
      step: 1,
      title: 'Seleccionar Especialista',
      description: 'Elige el especialista para tu consulta',
      icon: UserCheck
    },
    {
      step: 2,
      title: 'Información Personal',
      description: 'Datos básicos y de contacto',
      icon: User
    },
    {
      step: 3,
      title: 'Cita Médica',
      description: 'Fecha, hora y motivo de consulta',
      icon: Calendar
    },
    {
      step: 4,
      title: 'Método de Pago',
      description: 'Selecciona cómo deseas pagar',
      icon: CreditCard
    },
    {
      step: 5,
      title: 'Confirmación',
      description: 'Revisa y confirma tu cita',
      icon: CheckCircle
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar errores del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.especialista_id) newErrors.especialista_id = 'Selecciona un especialista'
    }

    if (step === 2) {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
      if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son requeridos'
      if (!formData.email.trim()) newErrors.email = 'El email es requerido'
      if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido'
      if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida'
      if (!formData.genero) newErrors.genero = 'El género es requerido'
    }

    if (step === 3) {
      if (!formData.fecha_cita) newErrors.fecha_cita = 'La fecha de cita es requerida'
      if (!formData.hora_cita) newErrors.hora_cita = 'La hora de cita es requerida'
      if (!formData.motivo_consulta.trim()) newErrors.motivo_consulta = 'El motivo de consulta es requerido'
    }

    if (step === 4) {
      if (!formData.metodo_pago) newErrors.metodo_pago = 'Selecciona un método de pago'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      // Datos del paciente
      const pacienteData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        telefono: formData.telefono,
        fecha_nacimiento: formData.fecha_nacimiento,
        genero: formData.genero,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        estado: formData.estado,
        codigo_postal: formData.codigo_postal
      }

      // Crear o actualizar paciente
      const paciente = await crearPaciente(pacienteData)
      
      // Datos de la cita
      const citaData = {
        paciente_id: paciente.id,
        especialista_id: formData.especialista_id,
        paquete_id: selectedPackage.id,
        fecha_hora: `${formData.fecha_cita}T${formData.hora_cita}`,
        motivo: formData.motivo_consulta,
        sintomas: formData.sintomas_previos || null,
        primera_cita: formData.primera_cita,
        metodo_pago: formData.metodo_pago,
        precio: selectedPackage.price
      }

      // Crear cita con validación
      const cita = await crearCita(citaData)
      
      // Guardar información de la cita para mostrar en la confirmación
      setFormData(prev => ({
        ...prev,
        cita_id: cita.id,
        cita_confirmada: true
      }))
      
      // Obtener datos del especialista para las notificaciones
      const especialistaSeleccionado = especialistas.find(
        esp => esp.id === formData.especialista_id
      )
      
      // Enviar notificaciones de confirmación
      if (especialistaSeleccionado) {
        try {
          await enviarConfirmacionCita(cita, paciente, especialistaSeleccionado)
          console.log('Notificaciones de confirmación enviadas')
          
          // Programar recordatorios automáticos
          await programarRecordatorios(cita.id)
          console.log('Recordatorios programados correctamente')
        } catch (notifError) {
          console.error('Error al enviar notificaciones:', notifError)
          // No bloqueamos el flujo si falla el envío de notificaciones
        }
      }
      
      setCurrentStep(5) // Avanzar a la confirmación
    } catch (error) {
      console.error('Error al crear reservación:', error)
      
      // Manejar errores específicos
      let errorMessage = 'Hubo un error al crear la cita. Por favor, intenta de nuevo.'
      
      if (error.message.includes('horario seleccionado ya no está disponible')) {
        errorMessage = 'El horario seleccionado ya no está disponible. Por favor, selecciona otro horario.'
        // Volver al paso de selección de fecha/hora
        setCurrentStep(3)
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Seleccionar Especialista</h3>
            
            {loadingEspecialistas ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : especialistas.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No hay especialistas disponibles para este paquete.</p>
                <button 
                  onClick={onBack}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Seleccionar otro paquete
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {especialistas.map(especialista => (
                  <div 
                    key={especialista.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.especialista_id === especialista.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                    onClick={() => handleSelectEspecialista(especialista)}
                  >
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                        {especialista.foto_url ? (
                          <img 
                            src={especialista.foto_url} 
                            alt={`${especialista.nombre} ${especialista.apellidos}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                            <UserCheck size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{especialista.nombre} {especialista.apellidos}</h4>
                        <p className="text-gray-600">{especialista.especialidad}</p>
                        <p className="text-sm text-gray-500 mt-1">{especialista.descripcion || 'Especialista disponible para este paquete'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {errors.especialista_id && (
              <p className="text-red-500 text-sm mt-2">{errors.especialista_id}</p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.apellidos ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tus apellidos"
                />
                {errors.apellidos && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.apellidos}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.telefono}
                  </p>
                )}
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_nacimiento && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fecha_nacimiento}
                  </p>
                )}
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  value={formData.genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.genero ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona género</option>
                  {GENDER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.genero && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.genero}
                  </p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Calle, número, colonia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ciudad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange('ciudad', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tu ciudad"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {MEXICAN_STATES.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Código postal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.codigo_postal}
                  onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Información de la Cita</h3>
            
            {/* Calendario interactivo */}
            <CalendarSelector 
              especialistaId={formData.especialista_id}
              selectedDate={formData.fecha_cita ? new Date(formData.fecha_cita) : null}
              selectedTime={formData.hora_cita}
              onSelectDateTime={(date, time) => {
                if (date) {
                  const formattedDate = date.toISOString().split('T')[0];
                  handleInputChange('fecha_cita', formattedDate);
                }
                if (time !== undefined) {
                  handleInputChange('hora_cita', time);
                }
              }}
            />
            
            {(errors.fecha_cita || errors.hora_cita) && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fecha_cita || errors.hora_cita}
              </p>
            )}

            {/* Motivo de consulta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motivo de Consulta *
              </label>
              <textarea
                value={formData.motivo_consulta}
                onChange={(e) => handleInputChange('motivo_consulta', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.motivo_consulta ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe brevemente el motivo de tu consulta..."
              />
              {errors.motivo_consulta && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.motivo_consulta}
                </p>
              )}
            </div>

            {/* Síntomas previos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Síntomas o Molestias Previas
              </label>
              <textarea
                value={formData.sintomas_previos}
                onChange={(e) => handleInputChange('sintomas_previos', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="¿Has tenido algún síntoma o molestia relacionada? (opcional)"
              />
            </div>

            {/* Primera cita */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.primera_cita}
                  onChange={(e) => handleInputChange('primera_cita', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Es mi primera cita en Sportiva
                </span>
              </label>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Método de Pago</h3>
            
            {/* Resumen del paquete */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-4">Resumen de tu consulta</h4>
              <div className="flex justify-between items-center mb-2">
                <span>{selectedPackage.name}</span>
                <span className="font-semibold">${selectedPackage.price}</span>
              </div>
              <div className="text-sm text-gray-600">
                Duración: {selectedPackage.duration}
              </div>
            </div>

            {/* Métodos de pago */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selecciona tu método de pago *
              </label>
              {PAYMENT_METHODS.map(method => (
                <label key={method.value} className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value={method.value}
                    checked={formData.metodo_pago === method.value}
                    onChange={(e) => handleInputChange('metodo_pago', e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-3 font-medium">{method.label}</span>
                </label>
              ))}
              {errors.metodo_pago && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.metodo_pago}
                </p>
              )}
            </div>

            {/* Información de pago */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-2">Información importante</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• El pago se realizará el día de la consulta</li>
                <li>• Puedes cancelar hasta 24 horas antes sin costo</li>
                <li>• Llega 15 minutos antes de tu cita</li>
                <li>• Trae una identificación oficial</li>
              </ul>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h3 className="text-3xl font-bold text-blue-900">¡Reservación Completada!</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tu cita ha sido agendada correctamente. Recibirás un correo electrónico con los detalles de tu cita.
            </p>

            {/* Resumen de la cita */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto text-left">
              <h4 className="font-semibold text-lg text-blue-800 mb-4">Detalles de tu cita</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Especialista:</span>
                  <span className="font-medium">
                    {especialistas.find(e => e.id === formData.especialista_id)?.nombre || ''} {especialistas.find(e => e.id === formData.especialista_id)?.apellidos || ''}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Consulta:</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {formData.fecha_cita ? new Date(formData.fecha_cita).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : ''}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{formData.hora_cita} hrs</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-medium">${selectedPackage.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="font-medium">
                    {PAYMENT_METHODS.find(m => m.value === formData.metodo_pago)?.label || ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
              <h4 className="font-semibold text-blue-900 mb-3">Instrucciones importantes</h4>
              <div className="text-left space-y-2 text-sm text-blue-800">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-xs">1</div>
                  <span>Llega 15 minutos antes de tu cita</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-xs">2</div>
                  <span>Trae una identificación oficial</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-xs">3</div>
                  <span>Prepara tus preguntas para el especialista</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold hover:scale-105 transition-all"
              >
                Volver al inicio
              </button>
              <button
                onClick={() => window.print()}
                className="px-8 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Imprimir comprobante
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Función para seleccionar especialista
  const handleSelectEspecialista = (especialista) => {
    setSelectedEspecialista(especialista);
    handleInputChange('especialista_id', especialista.id);
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header con paquete seleccionado */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Cambiar paquete
            </button>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-blue-900">{selectedPackage.name}</h2>
              <p className="text-gray-600">${selectedPackage.price} • {selectedPackage.duration}</p>
            </div>
          </div>

          {/* Indicador de pasos */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center space-y-4 lg:space-y-0 lg:space-x-8 mb-12">
            {steps.map((step, index) => (
              <FormStep
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                isActive={currentStep === step.step}
                isCompleted={currentStep > step.step}
                isLastStep={index === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            {renderStepContent()}

            {/* Botones de navegación */}
            {currentStep < 4 && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Anterior
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Siguiente
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Confirmar Cita'}
                    {!isSubmitting && <CheckCircle className="ml-2 w-4 h-4" />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReservationForm