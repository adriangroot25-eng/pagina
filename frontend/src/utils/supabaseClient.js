import { createClient } from '@supabase/supabase-js'

// Estas URLs deberán ser reemplazadas con tus credenciales reales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones para interactuar con las tablas de la base de datos

// Paquetes de especialidad
export const getPaquetesEspecialidad = async () => {
  const { data, error } = await supabase
    .from('paquetes_especialidad')
    .select('*')
    .eq('activo', true)
  
  if (error) throw error
  return data
}

// Función para obtener especialistas por paquete
export const getEspecialistas = async (paqueteId) => {
  try {
    const { data, error } = await supabase
      .from('especialistas')
      .select('*')
      .eq('paquete_id', paqueteId)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error al obtener especialistas:', error)
    throw error
  }
}

// Función para crear un nuevo paciente
export const crearPaciente = async (pacienteData) => {
  try {
    const { data, error } = await supabase
      .from('pacientes')
      .insert([pacienteData])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error al crear paciente:', error)
    throw error
  }
}

// Función para crear una nueva cita con validación
export const crearCita = async (citaData) => {
  try {
    // Validar disponibilidad antes de crear la cita
    const fechaHora = new Date(citaData.fecha_hora);
    const fecha = fechaHora.toISOString().split('T')[0];
    const hora = citaData.fecha_hora.split('T')[1].substring(0, 8);
    
    // Verificar si el horario está disponible
    const { data: horarioDisponible, error: errorHorario } = await supabase
      .from('horarios_disponibles')
      .select('*')
      .eq('especialista_id', citaData.especialista_id)
      .eq('fecha', fecha)
      .eq('hora', hora)
      .eq('disponible', true)
      .single();
    
    if (errorHorario && errorHorario.code !== 'PGRST116') {
      throw new Error('Error al verificar disponibilidad: ' + errorHorario.message);
    }
    
    if (!horarioDisponible) {
      throw new Error('El horario seleccionado ya no está disponible. Por favor, selecciona otro horario.');
    }
    
    // Crear la cita usando la función RPC
    const { data, error } = await supabase
      .rpc('crear_cita', citaData);
    
    if (error) throw error;
    
    // Actualizar el horario como no disponible
    const { error: errorUpdate } = await supabase
      .from('horarios_disponibles')
      .update({ disponible: false })
      .eq('id', horarioDisponible.id);
    
    if (errorUpdate) {
      console.error('Error al actualizar disponibilidad:', errorUpdate);
      // No lanzamos error aquí para no afectar la creación de la cita
    }
    
    return data;
  } catch (error) {
    console.error('Error al crear cita:', error);
    throw error;
  }
}

// Función para obtener horarios disponibles
export const getHorariosDisponibles = async (especialistaId, fecha) => {
  try {
    const { data, error } = await supabase
      .from('horarios_disponibles')
      .select('*')
      .eq('especialista_id', especialistaId)
      .eq('fecha', fecha)
      .eq('disponible', true)
      .order('hora', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error)
    throw error
  }
}

// Pacientes
export const getPacientePorTelefono = async (telefono) => {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('telefono', telefono)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 es el código para "no se encontró ningún registro"
  return data
}

export const actualizarPaciente = async (telefono, pacienteData) => {
  const { data, error } = await supabase
    .from('pacientes')
    .update({ 
      ...pacienteData,
      fecha_actualizacion: new Date()
    })
    .eq('telefono', telefono)
    .select()
  
  if (error) throw error
  return data[0]
}

// Nota: La función getHorariosDisponibles ya está definida anteriormente

// Nota: La función crearCita ya está definida anteriormente
// Otras funciones relacionadas con citas

export const confirmarCita = async (citaId, pacienteId) => {
  const { data, error } = await supabase.rpc('confirmar_cita', {
    p_cita_id: citaId,
    p_paciente_id: pacienteId
  })
  
  if (error) throw error
  return data
}

export const editarCita = async (citaId, nuevaFecha, nuevaHora) => {
  const { data, error } = await supabase.rpc('editar_cita', {
    p_cita_id: citaId,
    p_nueva_fecha: nuevaFecha,
    p_nueva_hora: nuevaHora
  })
  
  if (error) throw error
  return data
}

export const cancelarCita = async (citaId, motivoCancelacion, pacienteId) => {
  const { data, error } = await supabase.rpc('cancelar_cita', {
    p_cita_id: citaId,
    p_motivo_cancelacion: motivoCancelacion,
    p_paciente_id: pacienteId
  })
  
  if (error) throw error
  return data
}

// Notificaciones
export const registrarNotificacion = async (notificacionData) => {
  const { data, error } = await supabase
    .from('notificaciones_enviadas')
    .insert([notificacionData])
    .select()
  
  if (error) throw error
  return data[0]
}