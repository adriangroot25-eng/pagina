FASE 1: SELECCIÓN DE PAQUETE Y CANAL 
1. Identificar canal de entrada (Web o WhatsApp) 
Si canal == "WhatsApp" entonces 
Iniciar flujo de conversación con chatbot/IA 
Registrar en BD: log_interacciones(canal: "WhatsApp", timestamp, session_id) 
Sino 
Cargar interfaz web de agendamiento 
Registrar en BD: log_interacciones(canal: "Web", timestamp, session_id) 
FinSi 
2. Consultar BD: SELECT * FROM paquetes_especialidad WHERE activo = true 
Mostrar al usuario: - Paquete 1: Medicina General - Paquete 2: Nutrición - Paquete 3: Fisioterapia - Paquete 4: Psicología 
3. Usuario selecciona paquete 
Almacenar temporalmente: sesion_temporal.paquete_id = paquete_seleccionado 
Consultar BD: SELECT especialista_id, nombre FROM especialistas  
WHERE especialidad_id = paquete_seleccionado AND activo = true 
FASE 2: CAPTURA DE INFORMACIÓN PERSONAL 
4. Mostrar formulario de datos personales 
Campos requeridos: 
8 
- nombre_completo - email - telefono - fecha_nacimiento - genero - direccion - ciudad - estado - codigo_postal 
5. Validar datos ingresados: 
Si telefono existe en BD entonces 
Consultar: SELECT * FROM pacientes WHERE telefono = telefono_ingresado 
Prellenar formulario con datos existentes 
paciente_existente = true 
Sino 
paciente_existente = false 
FinSi 
6. Guardar/Actualizar información del paciente: 
Si paciente_existente == true entonces 
UPDATE pacientes SET  
nombre = nuevo_nombre, 
email = nuevo_email, 
direccion = nueva_direccion, 
... (demás campos) 
fecha_actualizacion = NOW() 
WHERE telefono = telefono_ingresado 
Sino 
INSERT INTO pacientes ( 
nombre, email, telefono, fecha_nacimiento, genero, 
direccion, ciudad, estado, codigo_postal, 
fecha_registro, estado_paciente 
) VALUES ( 
9 
datos_ingresados..., 
NOW(), 'activo' 
) 
Obtener paciente_id generado 
FinSi 
FASE 3: SELECCIÓN DE FECHA Y HORA 
7. Consultar disponibilidad en tiempo real: 
Llamar a MotorDeDisponibilidad: 
SELECT fecha, hora_inicio, hora_fin 
FROM horarios_disponibles 
WHERE especialista_id = especialista_seleccionado 
AND fecha >= CURDATE() 
AND estado_slot = 'disponible' 
ORDER BY fecha, hora_inicio 
8. Mostrar calendario interactivo con horarios disponibles 
9. Usuario selecciona fecha y hora deseada 
Almacenar temporalmente: - sesion_temporal.fecha_seleccionada - sesion_temporal.hora_seleccionada 
10. Solicitar información adicional de la cita: - motivo_consulta (texto) - sintomas_previos (texto opcional) - notas_adicionales (texto opcional) 
FASE 4: VALIDACIÓN Y RESERVA TEMPORAL 
11. BLOQUEO ATÓMICO - Iniciar transacción de BD 
BEGIN TRANSACTION; 
10 
12. Verificar disponibilidad nuevamente (evitar reservas duplicadas): 
SELECT estado_slot FROM horarios_disponibles 
WHERE especialista_id = especialista_seleccionado 
AND fecha = fecha_seleccionada 
AND hora_inicio = hora_seleccionada 
FOR UPDATE; // Bloqueo de fila 
Si estado_slot != 'disponible' entonces 
ROLLBACK; 
Mostrar mensaje: "Este horario acaba de ser reservado" 
Sugerir horarios alternativos: 
SELECT fecha, hora_inicio, hora_fin 
FROM horarios_disponibles 
WHERE especialista_id = especialista_seleccionado 
AND fecha = fecha_seleccionada 
AND estado_slot = 'disponible' 
LIMIT 5; 
Volver al paso 9 
FinSi 
13. Crear registro de cita en BD: 
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
11 
fecha_creacion, 
fecha_ultima_modificacion 
) VALUES ( 
paciente_id, 
especialista_seleccionado, 
paquete_seleccionado, 
fecha_seleccionada, 
hora_seleccionada, 
hora_seleccionada + duracion_paquete, 
motivo_ingresado, 
sintomas_ingresados, 
'PROGRAMADA', // Estado inicial 
canal_entrada, 
NOW(), 
NOW() 
) 
Obtener cita_id generado 
14. Actualizar slot de disponibilidad: 
UPDATE horarios_disponibles 
SET estado_slot = 'reservado', 
cita_id = cita_id_generado, 
fecha_reserva = NOW() 
WHERE especialista_id = especialista_seleccionado 
AND fecha = fecha_seleccionada 
AND hora_inicio = hora_seleccionada; 
15. Registrar en historial de estados: 
INSERT INTO historial_estados_cita ( 
cita_id, 
estado_anterior, 
estado_nuevo, 
fecha_cambio, 
motivo_cambio, 
12 
usuario_cambio 
) VALUES ( 
cita_id_generado, 
NULL, 
'PROGRAMADA', 
NOW(), 
'Agendamiento inicial', 
paciente_id 
) 
COMMIT; // Finalizar transacción 
FASE 5: NOTIFICACIONES INICIALES 
16. Enviar notificaciones inmediatas: 
// Notificación al paciente 
Si canal == "WhatsApp" entonces 
Llamar webhook n8n: enviar_confirmacion_whatsapp 
Parámetros: { 
telefono: telefono_paciente, 
nombre: nombre_paciente, 
especialidad: nombre_paquete, 
fecha: fecha_cita_formateada, 
hora: hora_cita_formateada, 
cita_id: cita_id, 
especialista: nombre_especialista 
} 
Sino 
Enviar email de confirmación 
Enviar SMS de confirmación 
FinSi 
Registrar en BD: 
13 
INSERT INTO notificaciones_enviadas ( 
cita_id, 
tipo_notificacion, 
canal, 
estado_envio, 
fecha_envio 
) VALUES ( 
cita_id, 
'confirmacion_agendamiento', 
canal_utilizado, 
'enviado', 
NOW() 
) 
// Notificación al especialista 
INSERT INTO notificaciones_especialista ( 
especialista_id, 
cita_id, 
tipo_notificacion, 
estado, 
fecha_creacion 
) VALUES ( 
especialista_seleccionado, 
cita_id, 
'nueva_cita', 
'pendiente_lectura', 
NOW() 
) 
17. Mostrar confirmación al usuario: 
"
 ✅
 Cita agendada exitosamente - ID de cita: [cita_id] - Fecha: [fecha] - Hora: [hora] 
14 
- Especialidad: [paquete] - Estado: PROGRAMADA 
⚠
 IMPORTANTE: - Recibirás un recordatorio 24 horas antes - Deberás CONFIRMAR tu asistencia - Puedes modificar fecha/hora mientras esté en estado PROGRAMADA - Una vez confirmada, no podrás hacer cambios" 
FASE 6: PROCESO DE RECORDATORIO Y CONFIRMACIÓN 
18. Programar tarea automática en n8n (Cron Job): 
Ejecutar DIARIAMENTE a las 09:00 AM: 
SELECT c.cita_id, c.paciente_id, c.fecha_cita, c.hora_inicio, 
p.nombre, p.telefono, p.email, 
e.nombre as especialista, 
pk.nombre as paquete 
FROM citas c 
INNER JOIN pacientes p ON c.paciente_id = p.paciente_id 
INNER JOIN especialistas e ON c.especialista_id = e.especialista_id 
INNER JOIN paquetes_especialidad pk ON c.paquete_id = pk.paquete_id 
WHERE c.estado_cita = 'PROGRAMADA' 
AND c.fecha_cita = CURDATE() + INTERVAL 1 DAY 
AND NOT EXISTS ( 
SELECT 1 FROM notificaciones_enviadas 
WHERE cita_id = c.cita_id 
AND tipo_notificacion = 'recordatorio_24h' 
) 
19. Para cada cita encontrada: 
// Enviar recordatorio con opción de confirmar 
Si canal_original == "WhatsApp" entonces 
Llamar webhook n8n: enviar_recordatorio_whatsapp 
15 
Parámetros: { 
telefono: telefono_paciente, 
nombre: nombre_paciente, 
cita_id: cita_id, 
fecha: fecha_cita, 
hora: hora_cita, 
especialista: nombre_especialista, 
paquete: nombre_paquete, 
botones: [ 
{id: "confirmar", texto: "
 ✅
 Confirmar asistencia"}, 
{id: "editar", texto: "
 📝
 Cambiar fecha/hora"}, 
{id: "cancelar", texto: "
 ❌
 Cancelar cita"} 
] 
} 
Sino 
Enviar email con enlaces de acción: - URL_confirmar: https://sportiva.com/confirmar/{cita_id}/{token} - URL_editar: https://sportiva.com/editar/{cita_id}/{token} - URL_cancelar: https://sportiva.com/cancelar/{cita_id}/{token} 
FinSi 
// Registrar envío de recordatorio 
INSERT INTO notificaciones_enviadas ( 
cita_id, 
tipo_notificacion, 
canal, 
estado_envio, 
fecha_envio 
) VALUES ( 
cita_id, 
'recordatorio_24h', 
canal_utilizado, 
'enviado', 
NOW() 
16 
) 
FASE 7: GESTIÓN DE RESPUESTAS DEL PACIENTE 
20. CASO A: Paciente confirma asistencia 
// Webhook recibe confirmación 
Recibir: {accion: "confirmar", cita_id: id, token: token_validacion} 
// Validar token y estado de cita 
SELECT estado_cita, fecha_cita FROM citas 
WHERE cita_id = id AND token = token_validacion; 
Si estado_cita != 'PROGRAMADA' entonces 
Mostrar error: "Esta cita ya fue procesada anteriormente" 
Fin del flujo 
FinSi 
Si fecha_cita < CURDATE() entonces 
Mostrar error: "Esta cita ya expiró" 
Fin del flujo 
FinSi 
// Actualizar estado a CONFIRMADA 
BEGIN TRANSACTION; 
UPDATE citas 
SET estado_cita = 'CONFIRMADA', 
fecha_confirmacion = NOW(), 
fecha_ultima_modificacion = NOW(), 
usuario_confirma = paciente_id 
WHERE cita_id = id; 
INSERT INTO historial_estados_cita ( 
17 
cita_id, 
estado_anterior, 
estado_nuevo, 
fecha_cambio, 
motivo_cambio, 
usuario_cambio 
) VALUES ( 
id, 
'PROGRAMADA', 
'CONFIRMADA', 
NOW(), 
'Confirmación de asistencia por paciente', 
paciente_id 
) 
COMMIT; 
// Notificar confirmación 
Enviar mensaje: "
 ✅
 Tu cita ha sido CONFIRMADA.  
Ya no podrás modificar fecha u hora. 
Te esperamos el [fecha] a las [hora]" 
// Notificar al especialista 
INSERT INTO notificaciones_especialista ( 
especialista_id, 
cita_id, 
tipo_notificacion, 
estado 
) VALUES ( 
especialista_id, 
cita_id, 
'cita_confirmada', 
'pendiente_lectura' 
) 
18 
21. CASO B: Paciente solicita editar cita 
// Webhook recibe solicitud de edición 
Recibir: {accion: "editar", cita_id: id, token: token} 
// Validar estado 
SELECT estado_cita FROM citas WHERE cita_id = id; 
Si estado_cita == 'CONFIRMADA' entonces 
Mostrar error: "
 ⚠
 No puedes modificar una cita CONFIRMADA. 
Para cambios, comunícate con nosotros." 
Fin del flujo 
FinSi 
Si estado_cita != 'PROGRAMADA' entonces 
Mostrar error: "Esta cita no puede ser modificada" 
Fin del flujo 
FinSi 
// Permitir edición 
Obtener datos actuales: 
SELECT especialista_id, paquete_id, fecha_cita, hora_inicio 
FROM citas WHERE cita_id = id; 
// Mostrar calendario con disponibilidad 
Ir al paso 7 (consultar disponibilidad) 
// Cuando usuario selecciona nueva fecha/hora: 
BEGIN TRANSACTION; 
// Liberar slot anterior 
UPDATE horarios_disponibles 
SET estado_slot = 'disponible', 
19 
cita_id = NULL, 
fecha_reserva = NULL 
WHERE cita_id = id; 
// Reservar nuevo slot 
UPDATE horarios_disponibles 
SET estado_slot = 'reservado', 
cita_id = id, 
fecha_reserva = NOW() 
WHERE especialista_id = especialista_id 
AND fecha = nueva_fecha 
AND hora_inicio = nueva_hora 
AND estado_slot = 'disponible'; 
Si affected_rows == 0 entonces 
ROLLBACK; 
Mostrar: "Este horario ya no está disponible" 
Sugerir alternativas 
Volver a mostrar calendario 
Sino 
// Actualizar cita 
UPDATE citas 
SET fecha_cita = nueva_fecha, 
hora_inicio = nueva_hora, 
hora_fin = nueva_hora + duracion, 
fecha_ultima_modificacion = NOW(), 
contador_modificaciones = contador_modificaciones + 1 
WHERE cita_id = id; 
// Registrar cambio en historial 
INSERT INTO historial_estados_cita ( 
cita_id, 
estado_anterior, 
estado_nuevo, 
20 
fecha_cambio, 
motivo_cambio, 
detalles_cambio 
) VALUES ( 
id, 
'PROGRAMADA', 
'PROGRAMADA', 
NOW(), 
'Modificación de fecha/hora por paciente', 
JSON_OBJECT( 
'fecha_anterior', fecha_anterior, 
'fecha_nueva', nueva_fecha, 
'hora_anterior', hora_anterior, 
'hora_nueva', nueva_hora 
) 
) 
COMMIT; 
// Notificar cambio 
Enviar mensaje: "
 ✅
 Cita modificada exitosamente 
Nueva fecha: [nueva_fecha] 
Nueva hora: [nueva_hora] 
Estado: PROGRAMADA 
Recibirás recordatorio 24h antes" 
// Notificar al especialista 
Enviar notificación de cambio de horario 
FinSi 
22. CASO C: Paciente cancela cita 
Recibir: {accion: "cancelar", cita_id: id, token: token} 
21 
// Validar estado 
SELECT estado_cita FROM citas WHERE cita_id = id; 
Si estado_cita == 'CANCELADA' OR estado_cita == 'COMPLETADA' entonces 
Mostrar: "Esta cita ya fue procesada" 
Fin del flujo 
FinSi 
// Solicitar confirmación y motivo 
Mostrar: "¿Estás seguro de cancelar esta cita? 
Por favor indica el motivo (opcional):" 
Recibir motivo_cancelacion 
BEGIN TRANSACTION; 
// Liberar slot 
UPDATE horarios_disponibles 
SET estado_slot = 'disponible', 
cita_id = NULL, 
fecha_reserva = NULL 
WHERE cita_id = id; 
// Actualizar cita 
UPDATE citas 
SET estado_cita = 'CANCELADA', 
fecha_cancelacion = NOW(), 
motivo_cancelacion = motivo_cancelacion, 
cancelada_por = 'paciente', 
fecha_ultima_modificacion = NOW() 
WHERE cita_id = id; 
INSERT INTO historial_estados_cita ( 
cita_id, 
22 
estado_anterior, 
estado_nuevo, 
fecha_cambio, 
motivo_cambio, 
usuario_cambio 
) VALUES ( 
id, 
estado_actual, 
'CANCELADA', 
NOW(), 
motivo_cancelacion, 
paciente_id 
) 
COMMIT; 
Enviar mensaje: "Tu cita ha sido cancelada. 
Puedes agendar una nueva cuando lo necesites." 
FASE 8: GESTIÓN AUTOMÁTICA DE ESTADOS 
23. Tarea automática: Marcar citas vencidas (Ejecutar cada hora) 
UPDATE citas 
SET estado_cita = 'NO_ASISTIO', 
fecha_ultima_modificacion = NOW() 
WHERE estado_cita = 'PROGRAMADA' 
AND CONCAT(fecha_cita, ' ', hora_fin) < NOW(); 
Para cada cita actualizada: 
INSERT INTO historial_estados_cita (...) 
VALUES (..., 'PROGRAMADA', 'NO_ASISTIO', NOW(),  
'Cita no confirmada - expiró plazo', 'sistema') 
24. Tarea automática: Completar citas finalizadas 
23 
UPDATE citas 
SET estado_cita = 'COMPLETADA', 
fecha_ultima_modificacion = NOW() 
WHERE estado_cita = 'CONFIRMADA' 
AND CONCAT(fecha_cita, ' ', hora_fin) < NOW(); 
FASE 9: INTEGRACIÓN CON n8n Y APIs 
25. Configuración de webhooks en n8n: 
Webhook 1: /webhook/agendar-cita - Recibe datos de formulario web/WhatsApp - Ejecuta validaciones - Llama a API de disponibilidad - Crea registros en BD - Dispara notificaciones 
Webhook 2: /webhook/confirmar-cita - Recibe confirmación de paciente - Actualiza estado a CONFIRMADA - Registra en historial - Notifica a especialista 
Webhook 3: /webhook/editar-cita - Valida estado actual - Libera slot anterior - Reserva nuevo slot - Actualiza BD 
Webhook 4: /webhook/cancelar-cita - Valida y cancela cita - Libera slot - Notifica cancelación 
24 
Webhook 5: /webhook/recordatorios-diarios - Ejecuta diariamente (cron) - Identifica citas a recordar - Envía notificaciones masivas 
26. Integración con API de IA (para WhatsApp): 
Flujo conversacional: 
1. IA recibe mensaje del usuario 
2. Identifica intención (agendar/editar/cancelar/consultar) 
3. Extrae información estructurada 
4. Llama a webhook correspondiente de n8n 
5. Recibe respuesta y la formatea para usuario 
6. Mantiene contexto de conversación 
ESTRUCTURA DE BASE DE DATOS 
Tabla: pacientes - paciente_id (PK, INT, AUTO_INCREMENT) - nombre (VARCHAR) - email (VARCHAR) - telefono (VARCHAR, UNIQUE) - fecha_nacimiento (DATE) - genero (ENUM) - direccion, ciudad, estado, codigo_postal - fecha_registro (DATETIME) - fecha_actualizacion (DATETIME) - estado_paciente (ENUM: 'activo', 'inactivo') 
Tabla: especialistas - especialista_id (PK, INT) - nombre (VARCHAR) - especialidad_id (FK) - activo (BOOLEAN) 
25 
Tabla: paquetes_especialidad - paquete_id (PK, INT) - nombre (VARCHAR) - descripcion (TEXT) - duracion_minutos (INT) - precio (DECIMAL) - activo (BOOLEAN) 
Tabla: citas - cita_id (PK, INT, AUTO_INCREMENT) - paciente_id (FK) - especialista_id (FK) - paquete_id (FK) - fecha_cita (DATE) - hora_inicio (TIME) - hora_fin (TIME) - estado_cita (ENUM: 'PROGRAMADA', 'CONFIRMADA', 'COMPLETADA',  
'CANCELADA', 'NO_ASISTIO') - motivo_consulta (TEXT) - sintomas_previos (TEXT) - canal_agendamiento (ENUM: 'web', 'whatsapp') - fecha_creacion (DATETIME) - fecha_confirmacion (DATETIME) - fecha_cancelacion (DATETIME) - fecha_ultima_modificacion (DATETIME) - motivo_cancelacion (TEXT) - cancelada_por (ENUM: 'paciente', 'especialista', 'sistema') - contador_modificaciones (INT) - token (VARCHAR) // Para validar acciones 
Tabla: horarios_disponibles - slot_id (PK, INT, AUTO_INCREMENT) - especialista_id (FK) - fecha (DATE) 
26 
- hora_inicio (TIME) - hora_fin (TIME) - estado_slot (ENUM: 'disponible', 'reservado', 'bloqueado') - cita_id (FK, NULLABLE) - fecha_reserva (DATETIME) 
Tabla: historial_estados_cita - historial_id (PK, INT, AUTO_INCREMENT) - cita_id (FK) - estado_anterior (VARCHAR) - estado_nuevo (VARCHAR) - fecha_cambio (DATETIME) - motivo_cambio (TEXT) - detalles_cambio (JSON) - usuario_cambio (VARCHAR) 
Tabla: notificaciones_enviadas - notificacion_id (PK, INT, AUTO_INCREMENT) - cita_id (FK) - tipo_notificacion (ENUM: 'confirmacion_agendamiento',  
'recordatorio_24h', 'confirmacion_asistencia', 
'modificacion_cita', 'cancelacion') - canal (ENUM: 'whatsapp', 'email', 'sms') - estado_envio (ENUM: 'enviado', 'fallido', 'pendiente') - fecha_envio (DATETIME) - contenido_mensaje (TEXT) 
Fin 