import { supabase } from './supabaseClient';
import { enviarNotificacionEmail, enviarNotificacionSMS } from './notificationService';

// Función para actualizar automáticamente el estado de las citas
export const actualizarEstadosCitas = async () => {
  try {
    const ahora = new Date();
    
    // 1. Marcar citas pasadas como "completadas" o "no asistió"
    const { data: citasPasadas, error: errorPasadas } = await supabase
      .from('citas')
      .select('*')
      .in('estado', ['pendiente', 'confirmada'])
      .lt('fecha_hora', ahora.toISOString());
    
    if (errorPasadas) throw errorPasadas;
    
    // Procesar cada cita pasada
    for (const cita of citasPasadas) {
      const nuevoEstado = cita.estado === 'confirmada' ? 'completada' : 'no_asistio';
      
      await supabase
        .from('citas')
        .update({ 
          estado: nuevoEstado,
          fecha_actualizacion: ahora.toISOString()
        })
        .eq('id', cita.id);
    }
    
    // 2. Enviar recordatorios para citas próximas (24 horas antes)
    const manana = new Date(ahora);
    manana.setDate(manana.getDate() + 1);
    
    const inicioManana = new Date(manana);
    inicioManana.setHours(0, 0, 0, 0);
    
    const finManana = new Date(manana);
    finManana.setHours(23, 59, 59, 999);
    
    const { data: citasManana, error: errorManana } = await supabase
      .from('citas')
      .select('*, pacientes(*), especialistas(*)')
      .in('estado', ['pendiente', 'confirmada'])
      .gte('fecha_hora', inicioManana.toISOString())
      .lte('fecha_hora', finManana.toISOString());
    
    if (errorManana) throw errorManana;
    
    // Enviar recordatorios para citas de mañana
    for (const cita of citasManana) {
      try {
        // Verificar si ya se envió recordatorio
        const { data: recordatorios } = await supabase
          .from('notificaciones_enviadas')
          .select('*')
          .eq('cita_id', cita.id)
          .eq('tipo', 'recordatorio_24h');
        
        if (recordatorios && recordatorios.length === 0) {
          // Enviar recordatorio
          const fechaHora = new Date(cita.fecha_hora);
          const fechaFormateada = fechaHora.toLocaleDateString('es-MX');
          const horaFormateada = fechaHora.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          const asunto = `Recordatorio: Tu cita médica es mañana - ${fechaFormateada}`;
          const mensaje = `
            <h2>Recordatorio de tu cita médica</h2>
            <p>Hola ${cita.pacientes.nombre},</p>
            <p>Te recordamos que tienes una cita agendada para mañana:</p>
            <ul>
              <li><strong>Especialista:</strong> ${cita.especialistas.nombre} ${cita.especialistas.apellidos}</li>
              <li><strong>Fecha:</strong> ${fechaFormateada}</li>
              <li><strong>Hora:</strong> ${horaFormateada}</li>
            </ul>
            <p>Por favor confirma tu asistencia en el siguiente enlace:</p>
            <p><a href="https://ejemplo.com/confirmar/${cita.id}">Confirmar asistencia</a></p>
          `;
          
          const mensajeSMS = `RECORDATORIO: Tu cita con ${cita.especialistas.nombre} es mañana ${fechaFormateada} a las ${horaFormateada}. Confirma: https://ejemplo.com/confirmar/${cita.id}`;
          
          // Enviar notificaciones
          await enviarNotificacionEmail(cita.pacientes.email, asunto, mensaje, cita.id);
          await enviarNotificacionSMS(cita.pacientes.telefono, mensajeSMS, cita.id);
          
          // Registrar envío
          await supabase
            .from('notificaciones_enviadas')
            .insert({
              cita_id: cita.id,
              tipo: 'recordatorio_24h',
              destinatario: cita.pacientes.email,
              asunto,
              contenido: mensaje,
              estado: 'enviado',
              fecha_envio: ahora.toISOString()
            });
        }
      } catch (error) {
        console.error(`Error al enviar recordatorio para cita ${cita.id}:`, error);
      }
    }
    
    return {
      success: true,
      citasPasadasActualizadas: citasPasadas.length,
      recordatoriosEnviados: citasManana.length
    };
  } catch (error) {
    console.error('Error en la automatización de estados:', error);
    return { success: false, error: error.message };
  }
};

// Función para gestionar citas no confirmadas
export const gestionarCitasNoConfirmadas = async () => {
  try {
    const ahora = new Date();
    const limite = new Date(ahora);
    limite.setHours(ahora.getHours() - 48); // 48 horas sin confirmar
    
    // Buscar citas pendientes creadas hace más de 48 horas
    const { data: citasSinConfirmar, error } = await supabase
      .from('citas')
      .select('*, pacientes(*)')
      .eq('estado', 'pendiente')
      .lt('created_at', limite.toISOString());
    
    if (error) throw error;
    
    // Enviar recordatorio final o cancelar automáticamente
    for (const cita of citasSinConfirmar) {
      try {
        // Verificar si ya se envió recordatorio final
        const { data: recordatorios } = await supabase
          .from('notificaciones_enviadas')
          .select('*')
          .eq('cita_id', cita.id)
          .eq('tipo', 'recordatorio_final');
        
        if (recordatorios && recordatorios.length === 0) {
          // Enviar recordatorio final
          const asunto = 'IMPORTANTE: Confirma tu cita o será cancelada';
          const mensaje = `
            <h2>Acción requerida: Confirma tu cita médica</h2>
            <p>Hola ${cita.pacientes.nombre},</p>
            <p>Notamos que aún no has confirmado tu cita médica programada. Si no confirmamos tu asistencia en las próximas 24 horas, la cita será cancelada automáticamente.</p>
            <p>Por favor confirma tu asistencia en el siguiente enlace:</p>
            <p><a href="https://ejemplo.com/confirmar/${cita.id}">Confirmar asistencia</a></p>
            <p>Si ya no deseas asistir, puedes cancelar la cita en el mismo enlace.</p>
          `;
          
          const mensajeSMS = `URGENTE: Tu cita médica será cancelada si no confirmas en 24h. Confirma aquí: https://ejemplo.com/confirmar/${cita.id}`;
          
          // Enviar notificaciones
          await enviarNotificacionEmail(cita.pacientes.email, asunto, mensaje, cita.id);
          await enviarNotificacionSMS(cita.pacientes.telefono, mensajeSMS, cita.id);
          
          // Registrar envío
          await supabase
            .from('notificaciones_enviadas')
            .insert({
              cita_id: cita.id,
              tipo: 'recordatorio_final',
              destinatario: cita.pacientes.email,
              asunto,
              contenido: mensaje,
              estado: 'enviado',
              fecha_envio: ahora.toISOString()
            });
        } else if (recordatorios && recordatorios.length > 0) {
          // Verificar si el recordatorio final se envió hace más de 24 horas
          const fechaRecordatorio = new Date(recordatorios[0].fecha_envio);
          const limite24h = new Date(ahora);
          limite24h.setHours(ahora.getHours() - 24);
          
          if (fechaRecordatorio < limite24h) {
            // Cancelar cita automáticamente
            await supabase
              .from('citas')
              .update({
                estado: 'cancelada',
                notas: 'Cancelada automáticamente por falta de confirmación',
                fecha_actualizacion: ahora.toISOString()
              })
              .eq('id', cita.id);
            
            // Notificar cancelación
            const asuntoCancelacion = 'Tu cita ha sido cancelada automáticamente';
            const mensajeCancelacion = `
              <h2>Cita cancelada automáticamente</h2>
              <p>Hola ${cita.pacientes.nombre},</p>
              <p>Tu cita médica ha sido cancelada automáticamente debido a falta de confirmación.</p>
              <p>Si aún deseas agendar una cita, por favor realiza una nueva reserva en nuestro sitio web.</p>
            `;
            
            await enviarNotificacionEmail(cita.pacientes.email, asuntoCancelacion, mensajeCancelacion, cita.id);
          }
        }
      } catch (error) {
        console.error(`Error al gestionar cita no confirmada ${cita.id}:`, error);
      }
    }
    
    return {
      success: true,
      citasProcesadas: citasSinConfirmar.length
    };
  } catch (error) {
    console.error('Error en la gestión de citas no confirmadas:', error);
    return { success: false, error: error.message };
  }
};

// Función principal para ejecutar todas las automatizaciones
export const ejecutarAutomatizaciones = async () => {
  try {
    // 1. Actualizar estados de citas
    const resultadoEstados = await actualizarEstadosCitas();
    
    // 2. Gestionar citas no confirmadas
    const resultadoNoConfirmadas = await gestionarCitasNoConfirmadas();
    
    return {
      success: true,
      resultadoEstados,
      resultadoNoConfirmadas
    };
  } catch (error) {
    console.error('Error al ejecutar automatizaciones:', error);
    return { success: false, error: error.message };
  }
};