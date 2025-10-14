// ===== UTILIDADES COMUNES SPORTIVA =====

/**
 * Hace scroll suave a una sección específica
 * @param {string} sectionId - ID de la sección sin el #
 */
export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * Genera URL de WhatsApp con mensaje personalizado
 * @param {string} phoneNumber - Número de WhatsApp (sin +)
 * @param {string} message - Mensaje a enviar
 * @returns {string} URL completa de WhatsApp
 */
export const generateWhatsAppURL = (phoneNumber, message) => {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Formatea un número de teléfono para mostrar
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  // Ejemplo: convierte "5551234567" a "(555) 123-4567"
  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
  }
  return phone
}

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Genera un delay de animación basado en el índice
 * @param {number} index - Índice del elemento
 * @param {number} baseDelay - Delay base en milisegundos (default: 200)
 * @returns {string} Delay CSS en formato "0.2s"
 */
export const generateAnimationDelay = (index, baseDelay = 200) => {
  return `${(index * baseDelay) / 1000}s`
}

/**
 * Debounce function para optimizar eventos
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Verifica si el dispositivo es móvil
 * @returns {boolean} True si es móvil
 */
export const isMobileDevice = () => {
  return window.innerWidth < 768
}

/**
 * Obtiene el año actual para el footer
 * @returns {number} Año actual
 */
export const getCurrentYear = () => {
  return new Date().getFullYear()
}

/**
 * Formatea una fecha a formato español
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Obtiene las iniciales de un nombre completo
 * @param {string} fullName - Nombre completo
 * @returns {string} Iniciales (ej: "Juan Pérez" -> "JP")
 */
export const getInitials = (fullName) => {
  return fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}