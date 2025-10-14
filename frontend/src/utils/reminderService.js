import { supabase } from './supabaseClient';
import { enviarRecordatorioCita } from './notificationService';

// Función para programar recordatorios para una cita
export const programarRecordatorios = async (citaId) => {
  try {
    // Obtener información de la cita
    const { data: cita, error: citaError } = await supabase
      .from('citas')
      .select('*, pacientes(*), especialistas(*)')
      .eq('id', citaId)
      .single();
    
    if (citaError) throw citaError;
    if (!cita) throw new Error('Cita no encontrada');
    
    // Registrar recordatorios en la base de datos
    const fechaCita = new Date(cita.fecha_hora);
    
    // Recordatorio 24 horas antes
    const fecha24h = new Date(fechaCita);
    fecha24h.setDate(fecha24h.getDate() - 1);
    
    // Recordatorio 2 horas antes
    const fecha2h = new Date(fechaCita);
    fecha2h.setHours(fecha2h.getHours() - 2);
    
    // Insertar recordatorios en la tabla
    const { data, error } = await supabase
      .from('recordatorios')
      .insert([
        {
          cita_id: citaId,
          tipo: '24h',
          fecha_programada: fecha24h.toISOString(),
          estado: 'pendiente'
        },
        {
          cita_id: citaId,
          tipo: '2h',
          fecha_programada: fecha2h.toISOString(),
          estado: 'pendiente'
        }
      ]);
    
    if (error) throw error;
    
    return { success: true, message: 'Recordatorios programados correctamente' };
  } catch (error) {
    console.error('Error al programar recordatorios:', error);
    return { success: false, error: error.message };
  }
};

// Función para procesar recordatorios pendientes
// En un entorno real, esta función se ejecutaría mediante un cron job o similar
export const procesarRecordatoriosPendientes = async () => {
  try {
    const ahora = new Date();
    
    // Obtener recordatorios pendientes cuya fecha programada ya pasó
    const { data: recordatorios, error } = await supabase
      .from('recordatorios')
      .select('*, citas(*, pacientes(*), especialistas(*))')
      .eq('estado', 'pendiente')
      .lt('fecha_programada', ahora.toISOString());
    
    if (error) throw error;
    
    // Procesar cada recordatorio
    const resultados = [];
    
    for (const recordatorio of recordatorios) {
      try {
        const cita = recordatorio.citas;
        const paciente = cita.pacientes;
        const especialista = cita.especialistas;
        
        // Enviar recordatorio
        await enviarRecordatorioCita(cita, paciente, especialista);
        
        // Actualizar estado del recordatorio
        const { error: updateError } = await supabase
          .from('recordatorios')
          .update({ estado: 'enviado', fecha_envio: new Date().toISOString() })
          .eq('id', recordatorio.id);
        
        if (updateError) throw updateError;
        
        resultados.push({
          id: recordatorio.id,
          success: true,
          message: `Recordatorio enviado para cita ${cita.id}`
        });
      } catch (recordatorioError) {
        console.error(`Error al procesar recordatorio ${recordatorio.id}:`, recordatorioError);
        
        resultados.push({
          id: recordatorio.id,
          success: false,
          error: recordatorioError.message
        });
      }
    }
    
    return {
      success: true,
      procesados: recordatorios.length,
      resultados
    };
  } catch (error) {
    console.error('Error al procesar recordatorios pendientes:', error);
    return { success: false, error: error.message };
  }
};

// Función para confirmar asistencia a una cita
export const confirmarAsistenciaCita = async (citaId, asistira = true) => {
  try {
    // Actualizar estado de la cita
    const nuevoEstado = asistira ? 'confirmada' : 'cancelada';
    
    const { data, error } = await supabase
      .from('citas')
      .update({ 
        estado: nuevoEstado,
        fecha_confirmacion: new Date().toISOString()
      })
      .eq('id', citaId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      cita: data,
      message: `Cita ${asistira ? 'confirmada' : 'cancelada'} correctamente`
    };
  } catch (error) {
    console.error('Error al confirmar asistencia:', error);
    return { success: false, error: error.message };
  }
};