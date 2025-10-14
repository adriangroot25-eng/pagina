// ===== CONSTANTES DE LA APLICACIÓN SPORTIVA =====

// Información de contacto
export const CONTACT_INFO = {
  phone: '(555) 123-4567',
  email: 'contacto@sportiva.com',
  whatsapp: '+52 55 1234-5678',
  whatsappNumber: '5215551234567', // Para links
  address: {
    street: 'Av. del Deporte 123',
    colony: 'Col. Olímpica', 
    city: 'Ciudad Apodaca, NL',
    full: 'Av. del Deporte 123, Col. Olímpica, Ciudad Apodaca, NL'
  },
  schedule: {
    weekdays: 'Lunes - Viernes: 8:00 AM - 6:00 PM',
    saturday: 'Sábados: 8:00 AM - 2:00 PM',
    sunday: 'Cerrado'
  }
}

// Navegación del header
export const NAVIGATION_ITEMS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'instalaciones', label: 'Instalaciones' },
  { id: 'nosotros', label: 'Sobre Nosotros' },
  { id: 'blog', label: 'Blog' },
  { id: 'contacto', label: 'Contacto' }
]

// Servicios médicos
export const MEDICAL_SERVICES = [
  {
    id: 'medicina',
    title: 'Medicina del Deporte',
    description: 'Diagnóstico especializado, tratamiento y prevención de lesiones deportivas para optimizar tu rendimiento atlético.',
    color: 'blue',
    icon: 'HeartPulse'
  },
  {
    id: 'fisioterapia', 
    title: 'Fisioterapia',
    description: 'Recuperación funcional y rehabilitación personalizada para volver a tu mejor nivel físico de manera segura.',
    color: 'green',
    icon: 'Dumbbell'
  },
  {
    id: 'psicologia',
    title: 'Psicología Deportiva', 
    description: 'Fortalecimiento mental para superar barreras, manejar la presión competitiva y alcanzar tus metas deportivas.',
    color: 'purple',
    icon: 'Brain'
  },
  {
    id: 'nutricion',
    title: 'Nutrición Deportiva',
    description: 'Planes de alimentación científicamente diseñados para potenciar tu energía, recuperación y salud general.',
    color: 'orange',
    icon: 'Apple'
  }
]

// Colores por servicio
export const SERVICE_COLORS = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600', 
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600'
}

// Mensajes de WhatsApp
export const WHATSAPP_MESSAGES = {
  default: 'Hola, me interesa conocer más sobre los servicios de Sportiva',
  appointment: 'Hola, me gustaría agendar una cita en Sportiva',
  info: 'Hola, quisiera información sobre sus servicios médicos deportivos'
}

// URLs y enlaces
export const SOCIAL_LINKS = {
  whatsapp: (message = WHATSAPP_MESSAGES.default) => 
    `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`,
  facebook: '#',
  instagram: 'https://www.instagram.com/sportivajrz/',
  youtube: '#',
  linkedin: '#'
}

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  intersection: {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  },
  delays: {
    short: '0.2s',
    medium: '0.4s', 
    long: '0.6s',
    extraLong: '0.8s'
  }
}
// Importar imágenes de instalaciones
import rehabilitacion from '../assets/rehabilitacion.png';
import gymespecializado from '../assets/gymespecializado.jpg';
import areadeentrenamiento from '../assets/areadeentrenamiento.jpg';
import diagnostico from '../assets/diagnostico.jpg';
import areadeterapia from '../assets/areadeterapia.jpg';
import consultoriosmedicos from '../assets/consultoriosmedicos.jpg';
import gymnespecializado from '../assets/gymnespecializado.jpg';
import laboratoriodeanalisis from '../assets/laboratoriodeanalisis.png';
import saladerecuperacion from '../assets/salasderecuperacion.jpg';

// Importar imágenes de doctores
import doctor1 from '../assets/doctor1.jpg';
import doctor2 from '../assets/doctor2.png';
import doctor3 from '../assets/doctor3.jpg';
import doctor4 from '../assets/doctor4.webp';
// Instalaciones de la clínica

export const FACILITIES_DATA = [
  {
    id: 'rehabilitation-room',
    name: 'Sala de Rehabilitación',
    description: 'Equipada con tecnología de vanguardia para terapia física y recuperación',
    image: rehabilitacion,
    category: 'therapy'
  },
  {
   id: 'specialized-gym',
    name: 'Gimnasio Especializado',
    description: 'Área de entrenamiento funcional con equipos deportivos profesionales',
    image: gymnespecializado,
    category: 'training'
  },
  {
     id: 'medical-offices',
    name: 'Consultorios Médicos',
    description: 'Consultorios privados para evaluaciones y diagnósticos especializados',
    image: consultoriosmedicos,
    category: 'medical'
  },
  {
     id: 'therapy-area',
    name: 'Área de Terapia',
    description: 'Espacio dedicado a sesiones de terapia individual y grupal',
    image: areadeterapia,
    category: 'therapy'
  },
  {
   id: 'analysis-lab',
    name: 'Laboratorio de Análisis',
    description: 'Laboratorio equipado para estudios biomecánicos y análisis deportivo',
    image: laboratoriodeanalisis,
    category: 'analysis'
  },
  {
    id: 'recovery-room',
    name: 'Sala de Recuperación',
    description: 'Ambiente tranquilo para sesiones de recuperación y relajación',
    image: saladerecuperacion,
    category: 'recovery'
  },
  {
    id: 'training-area',
    name: 'Área de Entrenamiento',
    description: 'Zona de entrenamiento funcional con equipamiento de última generación',
    image: areadeentrenamiento,
    category: 'training'
  },
  {
    id: 'diagnostic-center',
    name: 'Centro de Diagnóstico',
    description: 'Área especializada en diagnósticos deportivos y evaluaciones físicas',
    image: diagnostico,
    category: 'medical'
  }
]

// Categorías de instalaciones
export const FACILITY_CATEGORIES = {
  medical: { name: 'Médico', color: 'blue' },
  therapy: { name: 'Terapia', color: 'green' },
  training: { name: 'Entrenamiento', color: 'orange' },
  analysis: { name: 'Análisis', color: 'purple' },
  recovery: { name: 'Recuperación', color: 'teal' }
}

// Equipo médico
export const MEDICAL_TEAM = [
  {
    id: 'alex-turner',
    name: 'Dr. Alex Turner',
    specialty: 'Médico del Deporte',
    specialtyColor: 'blue',
    credentials: [
      'Especialista en Medicina del Deporte - UNAM',
      'Certificación en Biomecánica Deportiva',
      'Médico Oficial - Liga MX',
      '15 años de experiencia'
    ],
    description: 'Especialista en diagnóstico y tratamiento de lesiones deportivas, enfocado en la prevención y optimización del rendimiento atlético.',
    image: doctor1,
    achievements: [
      'Atención a atletas olímpicos',
      'Investigación en prevención de lesiones',
      'Autor de 25+ publicaciones científicas'
    ]
  },
  {
    id: 'maya-singh',
    name: 'Dra. Maya Singh',
    specialty: 'Fisioterapeuta',
    specialtyColor: 'green',
    credentials: [
      'Licenciatura en Fisioterapia - ITESM',
      'Maestría en Rehabilitación Deportiva',
      'Certificación en Terapia Manual',
      '12 años de experiencia'
    ],
    description: 'Experta en rehabilitación funcional y terapia manual, ayudando a atletas a recuperarse de forma rápida y segura.',
    image: doctor2,
    achievements: [
      'Rehabilitación de atletas profesionales',
      'Especialista en lesiones de columna',
      'Conferencista internacional'
    ]
  },
  {
    id: 'ben-carter',
    name: 'Lic. Ben Carter',
    specialty: 'Psicólogo Deportivo',
    specialtyColor: 'purple',
    credentials: [
      'Licenciatura en Psicología - UAM',
      'Especialidad en Psicología del Deporte',
      'Certificación en Coaching Mental',
      '10 años de experiencia'
    ],
    description: 'Enfocado en el fortalecimiento mental, manejo de la presión y desarrollo de la resiliencia en deportistas de élite.',
    image: doctor3,
    achievements: [
      'Trabajo con equipos nacionales',
      'Especialista en ansiedad competitiva',
      'Técnicas de visualización avanzada'
    ]
  },
  {
    id: 'sofia-rossi',
    name: 'Lic. Sofia Rossi',
    specialty: 'Nutrióloga',
    specialtyColor: 'orange',
    credentials: [
      'Licenciatura en Nutrición - UVM',
      'Maestría en Nutrición Deportiva',
      'Certificación Internacional en Suplementación',
      '8 años de experiencia'
    ],
    description: 'Diseña planes de alimentación personalizados para maximizar la energía, la recuperación y la salud general del atleta.',
    image: doctor4,
    achievements: [
      'Planes nutricionales para maratonistas',
      'Especialista en composición corporal',
      'Nutrición para deportes de resistencia'
    ]
  }
]

// Artículos del blog
export const BLOG_ARTICLES = [
  {
    id: 1,
    title: 'Hidratación: La clave para el rendimiento deportivo',
    excerpt: 'Descubre por qué la hidratación es crucial para optimizar tus entrenamientos y competencias deportivas.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
    category: 'Nutrición',
    categoryColor: 'orange',
    author: 'Lic. Sofia Rossi',
    authorId: 'sofia-rossi',
    publishDate: '2024-03-15',
    readTime: '5 min',
    featured: true,
    tags: ['hidratación', 'rendimiento', 'nutrición deportiva']
  },
  {
    id: 2,
    title: '5 Estiramientos esenciales después de entrenar',
    excerpt: 'Aprende los estiramientos clave para mejorar la recuperación muscular y prevenir lesiones deportivas.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    category: 'Fisioterapia',
    categoryColor: 'green',
    author: 'Dra. Maya Singh',
    authorId: 'maya-singh',
    publishDate: '2024-03-10',
    readTime: '7 min',
    featured: true,
    tags: ['estiramientos', 'recuperación', 'fisioterapia']
  },
  {
    id: 3,
    title: 'Manejo de la ansiedad pre-competitiva',
    excerpt: 'Técnicas y estrategias para controlar los nervios y rendir al máximo bajo presión competitiva.',
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=2070&auto=format&fit=crop',
    category: 'Psicología',
    categoryColor: 'purple',
    author: 'Lic. Ben Carter',
    authorId: 'ben-carter',
    publishDate: '2024-03-05',
    readTime: '6 min',
    featured: true,
    tags: ['ansiedad', 'psicología deportiva', 'competencia']
  },
  {
    id: 4,
    title: 'Prevención de lesiones en corredores',
    excerpt: 'Guía completa para runners sobre cómo evitar las lesiones más comunes y mantener un entrenamiento constante.',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2069&auto=format&fit=crop',
    category: 'Medicina del Deporte',
    categoryColor: 'blue',
    author: 'Dr. Alex Turner',
    authorId: 'alex-turner',
    publishDate: '2024-02-28',
    readTime: '8 min',
    featured: false,
    tags: ['running', 'prevención', 'lesiones']
  }
]

// Categorías del blog
export const BLOG_CATEGORIES = {
  'nutrición': { color: 'orange', bgColor: 'bg-orange-500' },
  'fisioterapia': { color: 'green', bgColor: 'bg-green-500' },
  'psicología': { color: 'purple', bgColor: 'bg-purple-500' },
  'medicina del deporte': { color: 'blue', bgColor: 'bg-blue-500' }
}

// Enlaces del footer
export const FOOTER_LINKS = {
  services: [
    { name: 'Medicina del Deporte', href: '#servicios' },
    { name: 'Fisioterapia', href: '#servicios' },
    { name: 'Psicología Deportiva', href: '#servicios' },
    { name: 'Nutrición', href: '#servicios' }
  ],
  navigation: [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Instalaciones', href: '#instalaciones' },
    { name: 'Sobre Nosotros', href: '#nosotros' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contacto', href: '#contacto' }
  ],
  legal: [
    { name: 'Aviso de Privacidad', href: '/privacidad' },
    { name: 'Términos y Condiciones', href: '/terminos' }
  ]
}

// Meta información
export const META_INFO = {
  title: 'Sportiva - Centro Integral Deportivo',
  description: 'Centro integral deportivo con especialistas en medicina del deporte, fisioterapia, nutrición y psicología deportiva en Ciudad Apodaca, Nuevo León.',
  keywords: 'medicina deportiva, fisioterapia, nutrición deportiva, psicología deportiva, Nuevo León, Ciudad Apodaca',
  author: 'Sportiva Centro Integral Deportivo'
}

// Paquetes de consulta
export const CONSULTATION_PACKAGES = [
  {
    id: 'medicina',
    name: 'Medicina Deportiva',
    price: 500,
    duration: '45 min',
    specialty: 'medicina',
    color: 'blue',
    icon: 'HeartPulse',
    includes: [
      'Evaluación médica completa',
      'Historial clínico deportivo', 
      'Examen físico especializado',
      'Recomendaciones personalizadas',
      'Plan de seguimiento'
    ],
    ideal_for: 'Atletas que buscan optimizar su rendimiento o tratar lesiones',
    description: 'Consulta integral con médico deportivo certificado para evaluar tu condición física y diseñar un plan de salud deportiva personalizado.'
  },
  {
    id: 'nutricion',
    name: 'Nutrición Deportiva',
    price: 500,
    duration: '60 min',
    specialty: 'nutricion',
    color: 'orange',
    icon: 'Apple',
    includes: [
      'Evaluación nutricional completa',
      'Análisis de composición corporal',
      'Plan alimentario personalizado',
      'Guía de suplementación',
      'Recetas deportivas'
    ],
    ideal_for: 'Deportistas que quieren mejorar su alimentación y composición corporal',
    description: 'Consulta especializada en nutrición deportiva para optimizar tu rendimiento a través de la alimentación.'
  },
  {
    id: 'fisioterapia',
    name: 'Fisioterapia Deportiva',
    price: 500,
    duration: '50 min',
    specialty: 'fisioterapia',
    color: 'green',
    icon: 'Dumbbell',
    includes: [
      'Evaluación biomecánica',
      'Análisis de movimiento',
      'Sesión de terapia manual',
      'Programa de ejercicios',
      'Plan de rehabilitación'
    ],
    ideal_for: 'Atletas con lesiones o que buscan prevenir problemas musculares',
    description: 'Sesión de fisioterapia especializada en deportes para tratar lesiones y mejorar tu función física.'
  },
  {
    id: 'psicologia',
    name: 'Psicología Deportiva',
    price: 500,
    duration: '50 min',
    specialty: 'psicologia',
    color: 'purple',
    icon: 'Brain',
    includes: [
      'Evaluación psicológica deportiva',
      'Test de personalidad atlética',
      'Técnicas de manejo de estrés',
      'Estrategias de motivación',
      'Plan de fortaleza mental'
    ],
    ideal_for: 'Deportistas que buscan mejorar su rendimiento mental y manejo de presión',
    description: 'Consulta psicológica enfocada en el desarrollo de habilidades mentales para el deporte.'
  },
  {
    id: 'personalizado',
    name: 'Paquete Personalizado',
    price: 'Variable',
    duration: 'Variable',
    specialty: 'multiple',
    color: 'gradient',
    icon: 'Settings',
    includes: [
      'Combina 2, 3 o 4 especialidades',
      'Evaluación integral multidisciplinaria',
      'Plan de tratamiento coordinado',
      'Descuentos por paquete',
      'Seguimiento conjunto'
    ],
    ideal_for: 'Atletas que necesitan atención integral de múltiples especialidades',
    description: 'Diseña tu propio paquete combinando las especialidades que necesitas con descuentos especiales.',
    customizable: true,
    pricing: {
      '2': { price: 900, discount: 100 },
      '3': { price: 1350, discount: 150 },
      '4': { price: 1700, discount: 300 }
    }
  }
]

// Estados y ciudades de México (para el formulario)
export const MEXICO_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Estado de México',
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos',
  'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
  'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
]

// Datos del formulario de reserva
export const FORM_STEPS = [
  {
    id: 1,
    title: 'Información Personal',
    description: 'Datos básicos para tu registro'
  },
  {
    id: 2,
    title: 'Información Médica',
    description: 'Datos importantes para tu consulta'
  },
  {
    id: 3,
    title: 'Fecha y Hora',
    description: 'Selecciona cuándo quieres tu consulta'
  },
  {
    id: 4,
    title: 'Confirmación',
    description: 'Revisa y confirma tu reservación'
  }
]


// Estados de México
export const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Coahuila', 
  'Colima', 'Chiapas', 'Chihuahua', 'Ciudad de México', 'Durango', 'Guanajuato', 
  'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos', 'Nayarit', 
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
]

// Géneros
export const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' }
]

// Métodos de pago
export const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
  { value: 'transferencia', label: 'Transferencia bancaria' }
]