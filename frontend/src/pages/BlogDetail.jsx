import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Clock, Calendar, User, Tag, Share2 } from 'lucide-react'

export default function BlogDetail() {
  const { id } = useParams()
  
  // Hacer scroll al top cuando el componente se monte
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  const blogPosts = {
    1: {
      id: 1,
      title: 'Hidratación: La clave para el rendimiento deportivo',
      excerpt: 'Descubre por qué la hidratación es crucial para optimizar tus entrenamientos y competencias.',
      content: `
        <h2>¿Por qué es tan importante la hidratación?</h2>
        <p>La hidratación adecuada es fundamental para el rendimiento deportivo y la salud general. Durante el ejercicio, nuestro cuerpo pierde agua y electrolitos a través del sudor.</p>
        
        <h3>Efectos de la deshidratación</h3>
        <p>Una pérdida de tan solo 2% del peso corporal en agua puede resultar en:</p>
        <ul>
          <li>Disminución del rendimiento físico</li>
          <li>Aumento de la fatiga</li>
          <li>Mayor riesgo de lesiones</li>
          <li>Dificultad para regular la temperatura corporal</li>
        </ul>
        
        <h3>Estrategias de hidratación</h3>
        <p><strong>Antes del ejercicio:</strong> Bebe 500-600ml de agua 2-3 horas antes y 200-300ml adicionales 10-20 minutos antes de comenzar.</p>
        <p><strong>Durante el ejercicio:</strong> Para actividades que duran más de una hora, consume 150-250ml cada 15-20 minutos.</p>
        <p><strong>Después del ejercicio:</strong> Repone 150% del peso perdido durante el ejercicio.</p>
      `,
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
      category: 'Nutrición',
      categoryColor: 'bg-orange-500',
      author: 'Lic. Sofia Rossi',
      authorBio: 'Nutrióloga especializada en nutrición deportiva con más de 7 años de experiencia.',
      publishDate: '2024-03-15',
      readTime: '5 min',
      tags: ['hidratación', 'rendimiento', 'nutrición', 'salud']
    },
    2: {
      id: 2,
      title: '5 Estiramientos esenciales después de entrenar',
      excerpt: 'Aprende los estiramientos clave para mejorar la recuperación muscular y prevenir lesiones.',
      content: `
        <h2>La importancia de los estiramientos post-entrenamiento</h2>
        <p>Los estiramientos después del ejercicio ayudan a reducir la tensión muscular y mejorar la flexibilidad.</p>
        
        <h3>1. Estiramiento de cuádriceps</h3>
        <p>De pie, dobla una rodilla llevando el talón hacia los glúteos. Mantén 30 segundos cada pierna.</p>
        
        <h3>2. Estiramiento de isquiotibiales</h3>
        <p>Sentado, extiende una pierna y inclínate hacia adelante. Mantén 30 segundos cada pierna.</p>
      `,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
      category: 'Fisioterapia',
      categoryColor: 'bg-green-500',
      author: 'Dra. Maya Singh',
      authorBio: 'Fisioterapeuta especializada en rehabilitación deportiva.',
      publishDate: '2024-03-10',
      readTime: '7 min',
      tags: ['estiramientos', 'recuperación', 'prevención']
    },
    3: {
      id: 3,
      title: 'Manejo de la ansiedad pre-competitiva',
      excerpt: 'Técnicas y estrategias para controlar los nervios y rendir al máximo bajo presión.',
      content: `
        <h2>Entendiendo la ansiedad pre-competitiva</h2>
        <p>La ansiedad antes de una competencia es normal y puede ser beneficiosa si se maneja correctamente.</p>
        
        <h3>Técnicas de respiración</h3>
        <p>La respiración profunda es una herramienta efectiva para manejar la ansiedad.</p>
        
        <h3>Visualización positiva</h3>
        <p>Imagina tu rendimiento ideal antes de competir.</p>
      `,
      image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=2070&auto=format&fit=crop',
      category: 'Psicología',
      categoryColor: 'bg-purple-500',
      author: 'Lic. Ben Carter',
      authorBio: 'Psicólogo deportivo especializado en rendimiento mental.',
      publishDate: '2024-03-05',
      readTime: '6 min',
      tags: ['psicología', 'ansiedad', 'competencia']
    }
  }

  const blog = blogPosts[id]

  if (!blog) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-8">El artículo que buscas no existe.</p>
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Ver más artículos
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8 animate-fade-in-up">
            <div className="mb-4">
              <span className={`${blog.categoryColor} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                {blog.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {blog.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(blog.publishDate)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{blog.readTime} de lectura</span>
              </div>
              <button onClick={handleShare} className="flex items-center hover:text-blue-600 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                <span>Compartir</span>
              </button>
            </div>
          </header>

          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl animate-scale-in" style={{ animationDelay: '300ms' }}>
            <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover" />
          </div>

          <div className="prose prose-lg max-w-none mb-12 animate-fade-in-up" style={{ animationDelay: '400ms' }} dangerouslySetInnerHTML={{ __html: blog.content }} />

          <div className="border-t border-gray-200 pt-8 mb-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-12 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-lg font-semibold">
                  {blog.author.split(' ')[0].charAt(0)}{blog.author.split(' ')[1].charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{blog.author}</h3>
                <p className="text-gray-600 mb-4">{blog.authorBio}</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm">
                  Agendar consulta
                </button>
              </div>
            </div>
          </div>

          <div className="text-center animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <Link to="/" className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full font-semibold transition-all hover:scale-105">
              Ver más artículos
            </Link>
          </div>
        </article>
      </div>

      <style jsx>{`
        .prose h2 { font-size: 1.875rem; font-weight: 700; color: #1e40af; margin-top: 2rem; margin-bottom: 1rem; }
        .prose h3 { font-size: 1.5rem; font-weight: 600; color: #1e40af; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .prose p { margin-bottom: 1.5rem; color: #4a5568; line-height: 1.8; }
        .prose ul { margin: 1.5rem 0; padding-left: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; color: #4a5568; }
        .prose strong { font-weight: 600; color: #1f2937; }
      `}</style>
    </div>
  )
}