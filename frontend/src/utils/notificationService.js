import { supabase } from './supabaseClient';

// Función para enviar notificación por email
export const enviarNotificacionEmail = async (destinatario, asunto, contenido, citaId) => {
  try {
    // En un entorno real, aquí se integraría con un servicio de email como SendGrid, Mailgun, etc.
    // Para este ejemplo, simularemos el envío registrando en la tabla de notificaciones
    
    const { data, error } = await supabase
      .from('notificaciones_enviadas')
      .insert({
        cita_id: citaId,
        tipo: 'email',
        destinatario,
        asunto,
        contenido,
        estado: 'enviado',
        fecha_envio: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log(`Email enviado a ${destinatario}: ${asunto}`);
    return data;
  } catch (error) {
    console.error('Error al enviar notificación por email:', error);
    throw error;
  }
};

// Función para enviar notificación por SMS
export const enviarNotificacionSMS = async (telefono, mensaje, citaId) => {
  try {
    // En un entorno real, aquí se integraría con un servicio de SMS como Twilio, Nexmo, etc.
    // Para este ejemplo, simularemos el envío registrando en la tabla de notificaciones
    
    const { data, error } = await supabase
      .from('notificaciones_enviadas')
      .insert({
        cita_id: citaId,
        tipo: 'sms',
        destinatario: telefono,
        asunto: 'Notificación de cita',
        contenido: mensaje,
        estado: 'enviado',
        fecha_envio: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log(`SMS enviado a ${telefono}: ${mensaje.substring(0, 30)}...`);
    return data;
  } catch (error) {
    console.error('Error al enviar notificación por SMS:', error);
    throw error;
  }
};

// Función para enviar notificación de confirmación de cita
export const enviarConfirmacionCita = async (cita, paciente, especialista) => {
  try {
    const fechaHora = new Date(cita.fecha_hora);
    const fechaFormateada = fechaHora.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const horaFormateada = fechaHora.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Contenido del email
    const asuntoEmail = `Confirmación de tu cita médica - ${fechaFormateada}`;
    const contenidoEmail = `
      <h2>¡Tu cita ha sido agendada con éxito!</h2>
      <p>Hola ${paciente.nombre},</p>
      <p>Te confirmamos que tu cita ha sido agendada correctamente:</p>
      <ul>
        <li><strong>Especialista:</strong> ${especialista.nombre} ${especialista.apellidos}</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Hora:</strong> ${horaFormateada}</li>
        <li><strong>Lugar:</strong> Consultorio #${especialista.consultorio || '101'}</li>
      </ul>
      <p>Para confirmar tu asistencia, por favor haz clic en el siguiente enlace:</p>
      <p><a href="https://ejemplo.com/confirmar/${cita.id}">Confirmar asistencia</a></p>
      <p>Si necesitas reprogramar o cancelar tu cita, por favor contáctanos con al menos 24 horas de anticipación.</p>
      <p>¡Gracias por tu preferencia!</p>
    `;
    
    // Contenido del SMS
    const contenidoSMS = `Tu cita con ${especialista.nombre} ${especialista.apellidos} está agendada para el ${fechaFormateada} a las ${horaFormateada}. Confirma aquí: https://ejemplo.com/confirmar/${cita.id}`;
    
    // Enviar notificaciones
    await enviarNotificacionEmail(paciente.email, asuntoEmail, contenidoEmail, cita.id);
    await enviarNotificacionSMS(paciente.telefono, contenidoSMS, cita.id);
    
    return true;
  } catch (error) {
    console.error('Error al enviar confirmación de cita:', error);
    throw error;
  }
};

// Función para enviar recordatorio de cita
export const enviarRecordatorioCita = async (cita, paciente, especialista) => {
  try {
    const fechaHora = new Date(cita.fecha_hora);
    const fechaFormateada = fechaHora.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    
    const horaFormateada = fechaHora.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Contenido del email
    const asuntoEmail = `Recordatorio: Tu cita médica es mañana - ${fechaFormateada}`;
    const contenidoEmail = `
      <h2>Recordatorio de tu cita médica</h2>
      <p>Hola ${paciente.nombre},</p>
      <p>Te recordamos que tienes una cita agendada para mañana:</p>
      <ul>
        <li><strong>Especialista:</strong> ${especialista.nombre} ${especialista.apellidos}</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Hora:</strong> ${horaFormateada}</li>
        <li><strong>Lugar:</strong> Consultorio #${especialista.consultorio || '101'}</li>
      </ul>
      <p>Por favor confirma tu asistencia respondiendo a este correo o haciendo clic en el siguiente enlace:</p>
      <p><a href="https://ejemplo.com/confirmar/${cita.id}">Confirmar asistencia</a></p>
      <p>Si necesitas reprogramar o cancelar tu cita, por favor contáctanos lo antes posible.</p>
      <p>¡Gracias por tu preferencia!</p>
    `;
    
    // Contenido del SMS
    const contenidoSMS = `RECORDATORIO: Tu cita con ${especialista.nombre} es mañana ${fechaFormateada} a las ${horaFormateada}. Confirma aquí: https://ejemplo.com/confirmar/${cita.id}`;
    
    // Enviar notificaciones
    await enviarNotificacionEmail(paciente.email, asuntoEmail, contenidoEmail, cita.id);
    await enviarNotificacionSMS(paciente.telefono, contenidoSMS, cita.id);
    
    return true;
  } catch (error) {
    console.error('Error al enviar recordatorio de cita:', error);
    throw error;
  }
};