// Configuración de WhatsApp para la automatización

// Número de WhatsApp de la clínica (formato: código de país + número sin espacios ni guiones)
// Ejemplo: Para México +52 55 1234 5678 sería: 5215512345678
export const WHATSAPP_CONFIG = {
  // TODO: Cambiar por el número real de tu clínica
  clinicNumber: '8120287163',

  // Mensaje de bienvenida
  welcomeMessage: 'Hola! Me gustaría agendar una cita en Sportiva.',

  // Configuración de mensajes automáticos
  autoReply: {
    enabled: true,
    message: 'Gracias por contactarnos. En breve un asesor te atenderá.'
  }
}

// Plantilla del mensaje de cita
export const createAppointmentMessage = (data) => {
  const { nombre, telefono, email, paquete, precio, duracion, fecha, hora, motivo } = data

  return `
🏥 *NUEVA CITA AGENDADA*

👤 *Paciente:* ${nombre}
📱 *Teléfono:* ${telefono}
📧 *Email:* ${email}

📦 *Paquete:* ${paquete}
💰 *Precio:* $${precio}
⏱️ *Duración:* ${duracion}

📅 *Fecha:* ${fecha}
🕐 *Hora:* ${hora}

${motivo ? `📝 *Motivo:* ${motivo}` : ''}

_Enviado desde SportivaMX_
  `.trim()
}
