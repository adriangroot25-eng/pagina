-- Tabla: pacientes
CREATE TABLE pacientes (
  paciente_id SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  email VARCHAR,
  telefono VARCHAR UNIQUE NOT NULL,
  fecha_nacimiento DATE,
  genero VARCHAR CHECK (genero IN ('masculino', 'femenino', 'otro')),
  direccion VARCHAR,
  ciudad VARCHAR,
  estado VARCHAR,
  codigo_postal VARCHAR,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  estado_paciente VARCHAR DEFAULT 'activo' CHECK (estado_paciente IN ('activo', 'inactivo'))
);

-- Tabla: paquetes_especialidad
CREATE TABLE paquetes_especialidad (
  paquete_id SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  descripcion TEXT,
  duracion_minutos INTEGER NOT NULL,
  precio DECIMAL(10, 2),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla: especialistas
CREATE TABLE especialistas (
  especialista_id SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  especialidad_id INTEGER REFERENCES paquetes_especialidad(paquete_id),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla: horarios_disponibles
CREATE TABLE horarios_disponibles (
  slot_id SERIAL PRIMARY KEY,
  especialista_id INTEGER REFERENCES especialistas(especialista_id),
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  estado_slot VARCHAR DEFAULT 'disponible' CHECK (estado_slot IN ('disponible', 'reservado', 'bloqueado')),
  cita_id INTEGER,
  fecha_reserva TIMESTAMP,
  UNIQUE (especialista_id, fecha, hora_inicio)
);

-- Tabla: citas
CREATE TABLE citas (
  cita_id SERIAL PRIMARY KEY,
  paciente_id INTEGER REFERENCES pacientes(paciente_id),
  especialista_id INTEGER REFERENCES especialistas(especialista_id),
  paquete_id INTEGER REFERENCES paquetes_especialidad(paquete_id),
  fecha_cita DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  estado_cita VARCHAR DEFAULT 'PROGRAMADA' CHECK (estado_cita IN ('PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO')),
  motivo_consulta TEXT,
  sintomas_previos TEXT,
  canal_agendamiento VARCHAR CHECK (canal_agendamiento IN ('web', 'whatsapp')),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_confirmacion TIMESTAMP,
  fecha_cancelacion TIMESTAMP,
  fecha_ultima_modificacion TIMESTAMP DEFAULT NOW(),
  motivo_cancelacion TEXT,
  cancelada_por VARCHAR CHECK (cancelada_por IN ('paciente', 'especialista', 'sistema')),
  contador_modificaciones INTEGER DEFAULT 0,
  token VARCHAR,
  usuario_confirma INTEGER
);

-- Tabla: historial_estados_cita
CREATE TABLE historial_estados_cita (
  historial_id SERIAL PRIMARY KEY,
  cita_id INTEGER REFERENCES citas(cita_id),
  estado_anterior VARCHAR,
  estado_nuevo VARCHAR NOT NULL,
  fecha_cambio TIMESTAMP DEFAULT NOW(),
  motivo_cambio TEXT,
  detalles_cambio JSONB,
  usuario_cambio VARCHAR
);

-- Tabla: notificaciones_enviadas
CREATE TABLE notificaciones_enviadas (
  notificacion_id SERIAL PRIMARY KEY,
  cita_id INTEGER REFERENCES citas(cita_id),
  tipo_notificacion VARCHAR CHECK (tipo_notificacion IN ('confirmacion_agendamiento', 'recordatorio_24h', 'confirmacion_asistencia', 'modificacion_cita', 'cancelacion')),
  canal VARCHAR CHECK (canal IN ('whatsapp', 'email', 'sms')),
  estado_envio VARCHAR DEFAULT 'pendiente' CHECK (estado_envio IN ('enviado', 'fallido', 'pendiente')),
  fecha_envio TIMESTAMP DEFAULT NOW(),
  contenido_mensaje TEXT
);

-- Tabla: notificaciones_especialista
CREATE TABLE notificaciones_especialista (
  notificacion_id SERIAL PRIMARY KEY,
  especialista_id INTEGER REFERENCES especialistas(especialista_id),
  cita_id INTEGER REFERENCES citas(cita_id),
  tipo_notificacion VARCHAR CHECK (tipo_notificacion IN ('nueva_cita', 'cita_confirmada', 'cita_modificada', 'cita_cancelada')),
  estado VARCHAR DEFAULT 'pendiente_lectura' CHECK (estado IN ('pendiente_lectura', 'leida')),
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Tabla: log_interacciones
CREATE TABLE log_interacciones (
  log_id SERIAL PRIMARY KEY,
  canal VARCHAR CHECK (canal IN ('Web', 'WhatsApp')),
  timestamp TIMESTAMP DEFAULT NOW(),
  session_id VARCHAR
);

-- Función para crear cita (transacción atómica)
CREATE OR REPLACE FUNCTION crear_cita(
  p_paciente_id INTEGER,
  p_especialista_id INTEGER,
  p_paquete_id INTEGER,
  p_fecha_cita DATE,
  p_hora_inicio TIME,
  p_hora_fin TIME,
  p_motivo_consulta TEXT,
  p_sintomas_previos TEXT,
  p_canal_agendamiento VARCHAR
) RETURNS JSONB AS $$
DECLARE
  v_cita_id INTEGER;
  v_token VARCHAR;
  v_estado_slot VARCHAR;
BEGIN
  -- Generar token único para la cita
  v_token := encode(gen_random_bytes(16), 'hex');
  
  -- Verificar disponibilidad nuevamente (evitar reservas duplicadas)
  SELECT estado_slot INTO v_estado_slot
  FROM horarios_disponibles
  WHERE especialista_id = p_especialista_id
  AND fecha = p_fecha_cita
  AND hora_inicio = p_hora_inicio
  FOR UPDATE;
  
  IF v_estado_slot != 'disponible' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Este horario acaba de ser reservado',
      'error_code', 'SLOT_NOT_AVAILABLE'
    );
  END IF;
  
  -- Crear registro de cita
  INSERT INTO citas (
    paciente_id,
    especialista_id,
    paquete_id,
    fecha_cita,
    hora_inicio,
    hora_fin,
    motivo_consulta,
    sintomas_previos,
    estado_cita,
    canal_agendamiento,
    fecha_creacion,
    fecha_ultima_modificacion,
    token
  ) VALUES (
    p_paciente_id,
    p_especialista_id,
    p_paquete_id,
    p_fecha_cita,
    p_hora_inicio,
    p_hora_fin,
    p_motivo_consulta,
    p_sintomas_previos,
    'PROGRAMADA',
    p_canal_agendamiento,
    NOW(),
    NOW(),
    v_token
  ) RETURNING cita_id INTO v_cita_id;
  
  -- Actualizar slot de disponibilidad
  UPDATE horarios_disponibles
  SET estado_slot = 'reservado',
      cita_id = v_cita_id,
      fecha_reserva = NOW()
  WHERE especialista_id = p_especialista_id
  AND fecha = p_fecha_cita
  AND hora_inicio = p_hora_inicio;
  
  -- Registrar en historial de estados
  INSERT INTO historial_estados_cita (
    cita_id,
    estado_anterior,
    estado_nuevo,
    fecha_cambio,
    motivo_cambio,
    usuario_cambio
  ) VALUES (
    v_cita_id,
    NULL,
    'PROGRAMADA',
    NOW(),
    'Agendamiento inicial',
    p_paciente_id::VARCHAR
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'cita_id', v_cita_id,
    'token', v_token
  );
END;
$$ LANGUAGE plpgsql;

-- Función para confirmar cita
CREATE OR REPLACE FUNCTION confirmar_cita(
  p_cita_id INTEGER,
  p_paciente_id INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_estado_cita VARCHAR;
  v_fecha_cita DATE;
BEGIN
  -- Validar token y estado de cita
  SELECT estado_cita, fecha_cita INTO v_estado_cita, v_fecha_cita
  FROM citas
  WHERE cita_id = p_cita_id
  FOR UPDATE;
  
  IF v_estado_cita != 'PROGRAMADA' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Esta cita ya fue procesada anteriormente',
      'error_code', 'INVALID_STATE'
    );
  END IF;
  
  IF v_fecha_cita < CURRENT_DATE THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Esta cita ya expiró',
      'error_code', 'EXPIRED'
    );
  END IF;
  
  -- Actualizar estado a CONFIRMADA
  UPDATE citas
  SET estado_cita = 'CONFIRMADA',
      fecha_confirmacion = NOW(),
      fecha_ultima_modificacion = NOW(),
      usuario_confirma = p_paciente_id
  WHERE cita_id = p_cita_id;
  
  -- Registrar en historial
  INSERT INTO historial_estados_cita (
    cita_id,
    estado_anterior,
    estado_nuevo,
    fecha_cambio,
    motivo_cambio,
    usuario_cambio
  ) VALUES (
    p_cita_id,
    'PROGRAMADA',
    'CONFIRMADA',
    NOW(),
    'Confirmación de asistencia por paciente',
    p_paciente_id::VARCHAR
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Cita confirmada exitosamente'
  );
END;
$$ LANGUAGE plpgsql;

-- Función para editar cita
CREATE OR REPLACE FUNCTION editar_cita(
  p_cita_id INTEGER,
  p_nueva_fecha DATE,
  p_nueva_hora TIME
) RETURNS JSONB AS $$
DECLARE
  v_estado_cita VARCHAR;
  v_especialista_id INTEGER;
  v_paquete_id INTEGER;
  v_fecha_anterior DATE;
  v_hora_anterior TIME;
  v_duracion INTEGER;
  v_affected_rows INTEGER;
BEGIN
  -- Validar estado
  SELECT 
    c.estado_cita, 
    c.especialista_id, 
    c.paquete_id, 
    c.fecha_cita, 
    c.hora_inicio,
    pe.duracion_minutos
  INTO 
    v_estado_cita, 
    v_especialista_id, 
    v_paquete_id, 
    v_fecha_anterior, 
    v_hora_anterior,
    v_duracion
  FROM citas c
  JOIN paquetes_especialidad pe ON c.paquete_id = pe.paquete_id
  WHERE c.cita_id = p_cita_id
  FOR UPDATE;
  
  IF v_estado_cita = 'CONFIRMADA' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No puedes modificar una cita CONFIRMADA',
      'error_code', 'CONFIRMED_APPOINTMENT'
    );
  END IF;
  
  IF v_estado_cita != 'PROGRAMADA' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Esta cita no puede ser modificada',
      'error_code', 'INVALID_STATE'
    );
  END IF;
  
  -- Liberar slot anterior
  UPDATE horarios_disponibles
  SET estado_slot = 'disponible',
      cita_id = NULL,
      fecha_reserva = NULL
  WHERE cita_id = p_cita_id;
  
  -- Reservar nuevo slot
  UPDATE horarios_disponibles
  SET estado_slot = 'reservado',
      cita_id = p_cita_id,
      fecha_reserva = NOW()
  WHERE especialista_id = v_especialista_id
  AND fecha = p_nueva_fecha
  AND hora_inicio = p_nueva_hora
  AND estado_slot = 'disponible';
  
  GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
  
  IF v_affected_rows = 0 THEN
    -- Revertir cambios en slot anterior
    UPDATE horarios_disponibles
    SET estado_slot = 'reservado',
        cita_id = p_cita_id,
        fecha_reserva = NOW()
    WHERE especialista_id = v_especialista_id
    AND fecha = v_fecha_anterior
    AND hora_inicio = v_hora_anterior;
    
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Este horario ya no está disponible',
      'error_code', 'SLOT_NOT_AVAILABLE'
    );
  END IF;
  
  -- Actualizar cita
  UPDATE citas
  SET fecha_cita = p_nueva_fecha,
      hora_inicio = p_nueva_hora,
      hora_fin = p_nueva_hora + (v_duracion * interval '1 minute'),
      fecha_ultima_modificacion = NOW(),
      contador_modificaciones = contador_modificaciones + 1
  WHERE cita_id = p_cita_id;
  
  -- Registrar cambio en historial
  INSERT INTO historial_estados_cita (
    cita_id,
    estado_anterior,
    estado_nuevo,
    fecha_cambio,
    motivo_cambio,
    detalles_cambio
  ) VALUES (
    p_cita_id,
    'PROGRAMADA',
    'PROGRAMADA',
    NOW(),
    'Modificación de fecha/hora por paciente',
    jsonb_build_object(
      'fecha_anterior', v_fecha_anterior,
      'fecha_nueva', p_nueva_fecha,
      'hora_anterior', v_hora_anterior,
      'hora_nueva', p_nueva_hora
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Cita modificada exitosamente'
  );
END;
$$ LANGUAGE plpgsql;

-- Función para cancelar cita
CREATE OR REPLACE FUNCTION cancelar_cita(
  p_cita_id INTEGER,
  p_motivo_cancelacion TEXT,
  p_paciente_id INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_estado_cita VARCHAR;
BEGIN
  -- Validar estado
  SELECT estado_cita INTO v_estado_cita
  FROM citas
  WHERE cita_id = p_cita_id
  FOR UPDATE;
  
  IF v_estado_cita = 'CANCELADA' OR v_estado_cita = 'COMPLETADA' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Esta cita ya fue procesada',
      'error_code', 'ALREADY_PROCESSED'
    );
  END IF;
  
  -- Liberar slot
  UPDATE horarios_disponibles
  SET estado_slot = 'disponible',
      cita_id = NULL,
      fecha_reserva = NULL
  WHERE cita_id = p_cita_id;
  
  -- Actualizar cita
  UPDATE citas
  SET estado_cita = 'CANCELADA',
      fecha_cancelacion = NOW(),
      motivo_cancelacion = p_motivo_cancelacion,
      cancelada_por = 'paciente',
      fecha_ultima_modificacion = NOW()
  WHERE cita_id = p_cita_id;
  
  -- Registrar en historial
  INSERT INTO historial_estados_cita (
    cita_id,
    estado_anterior,
    estado_nuevo,
    fecha_cambio,
    motivo_cambio,
    usuario_cambio
  ) VALUES (
    p_cita_id,
    v_estado_cita,
    'CANCELADA',
    NOW(),
    p_motivo_cancelacion,
    p_paciente_id::VARCHAR
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Cita cancelada exitosamente'
  );
END;
$$ LANGUAGE plpgsql;

-- Función para marcar citas vencidas (para ejecutar como tarea programada)
CREATE OR REPLACE FUNCTION marcar_citas_vencidas() RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_cita RECORD;
BEGIN
  FOR v_cita IN 
    SELECT cita_id, estado_cita
    FROM citas
    WHERE estado_cita = 'PROGRAMADA'
    AND CONCAT(fecha_cita, ' ', hora_fin)::TIMESTAMP < NOW()
  LOOP
    UPDATE citas
    SET estado_cita = 'NO_ASISTIO',
        fecha_ultima_modificacion = NOW()
    WHERE cita_id = v_cita.cita_id;
    
    INSERT INTO historial_estados_cita (
      cita_id,
      estado_anterior,
      estado_nuevo,
      fecha_cambio,
      motivo_cambio,
      usuario_cambio
    ) VALUES (
      v_cita.cita_id,
      v_cita.estado_cita,
      'NO_ASISTIO',
      NOW(),
      'Cita no confirmada - expiró plazo',
      'sistema'
    );
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Función para completar citas finalizadas (para ejecutar como tarea programada)
CREATE OR REPLACE FUNCTION completar_citas_finalizadas() RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_cita RECORD;
BEGIN
  FOR v_cita IN 
    SELECT cita_id, estado_cita
    FROM citas
    WHERE estado_cita = 'CONFIRMADA'
    AND CONCAT(fecha_cita, ' ', hora_fin)::TIMESTAMP < NOW()
  LOOP
    UPDATE citas
    SET estado_cita = 'COMPLETADA',
        fecha_ultima_modificacion = NOW()
    WHERE cita_id = v_cita.cita_id;
    
    INSERT INTO historial_estados_cita (
      cita_id,
      estado_anterior,
      estado_nuevo,
      fecha_cambio,
      motivo_cambio,
      usuario_cambio
    ) VALUES (
      v_cita.cita_id,
      v_cita.estado_cita,
      'COMPLETADA',
      NOW(),
      'Cita finalizada automáticamente',
      'sistema'
    );
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Insertar datos de ejemplo para paquetes de especialidad
INSERT INTO paquetes_especialidad (nombre, descripcion, duracion_minutos, precio, activo) VALUES
('Medicina General', 'Consulta médica general para diagnóstico y tratamiento de enfermedades comunes', 30, 50.00, true),
('Nutrición', 'Consulta con nutricionista para evaluación y plan alimenticio personalizado', 45, 60.00, true),
('Fisioterapia', 'Sesión de fisioterapia para rehabilitación y tratamiento de lesiones', 60, 70.00, true),
('Psicología', 'Consulta psicológica para evaluación y tratamiento de problemas emocionales', 50, 80.00, true);

-- Insertar datos de ejemplo para especialistas
INSERT INTO especialistas (nombre, especialidad_id, activo) VALUES
('Dr. Juan Pérez', 1, true),
('Dra. María González', 1, true),
('Lic. Carlos Rodríguez', 2, true),
('Lic. Ana Martínez', 2, true),
('Ft. Roberto Sánchez', 3, true),
('Ft. Laura Díaz', 3, true),
('Psic. Sofía López', 4, true),
('Psic. Daniel Torres', 4, true);

-- Crear horarios disponibles para los próximos 30 días
DO $$
DECLARE
  v_fecha DATE;
  v_especialista RECORD;
  v_hora TIME;
BEGIN
  FOR i IN 0..30 LOOP
    v_fecha := CURRENT_DATE + (i || ' days')::INTERVAL;
    
    -- Omitir fines de semana
    IF EXTRACT(DOW FROM v_fecha) NOT IN (0, 6) THEN
      FOR v_especialista IN SELECT especialista_id, especialidad_id FROM especialistas WHERE activo = true LOOP
        -- Horarios de mañana (8:00 - 12:00)
        v_hora := '08:00:00'::TIME;
        WHILE v_hora < '12:00:00'::TIME LOOP
          INSERT INTO horarios_disponibles (especialista_id, fecha, hora_inicio, hora_fin, estado_slot)
          VALUES (
            v_especialista.especialista_id,
            v_fecha,
            v_hora,
            v_hora + ((SELECT duracion_minutos FROM paquetes_especialidad WHERE paquete_id = v_especialista.especialidad_id) || ' minutes')::INTERVAL,
            'disponible'
          );
          
          v_hora := v_hora + '30 minutes'::INTERVAL;
        END LOOP;
        
        -- Horarios de tarde (14:00 - 18:00)
        v_hora := '14:00:00'::TIME;
        WHILE v_hora < '18:00:00'::TIME LOOP
          INSERT INTO horarios_disponibles (especialista_id, fecha, hora_inicio, hora_fin, estado_slot)
          VALUES (
            v_especialista.especialista_id,
            v_fecha,
            v_hora,
            v_hora + ((SELECT duracion_minutos FROM paquetes_especialidad WHERE paquete_id = v_especialista.especialidad_id) || ' minutes')::INTERVAL,
            'disponible'
          );
          
          v_hora := v_hora + '30 minutes'::INTERVAL;
        END LOOP;
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- Función para obtener citas que necesitan recordatorio 24h antes
CREATE OR REPLACE FUNCTION get_citas_recordatorio()
RETURNS TABLE (
    cita_id INTEGER,
    paciente_id INTEGER,
    fecha_cita DATE,
    hora_inicio TIME,
    token VARCHAR,
    canal_agendamiento VARCHAR,
    paciente_nombre VARCHAR,
    telefono VARCHAR,
    email VARCHAR,
    especialista_nombre VARCHAR,
    paquete_nombre VARCHAR
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.cita_id,
        c.paciente_id,
        c.fecha_cita,
        c.hora_inicio,
        c.token,
        c.canal_agendamiento,
        p.nombre AS paciente_nombre,
        p.telefono,
        p.email,
        e.nombre AS especialista_nombre,
        pk.nombre AS paquete_nombre
    FROM citas c
    INNER JOIN pacientes p ON c.paciente_id = p.paciente_id
    INNER JOIN especialistas e ON c.especialista_id = e.especialista_id
    INNER JOIN paquetes_especialidad pk ON c.paquete_id = pk.paquete_id
    WHERE c.estado_cita = 'PROGRAMADA'
    AND c.fecha_cita = CURRENT_DATE + INTERVAL '1 day'
    AND NOT EXISTS (
        SELECT 1 
        FROM notificaciones_enviadas ne
        WHERE ne.cita_id = c.cita_id
        AND ne.tipo_notificacion = 'recordatorio_24h'
    );
END;
$$;








