import { Clock, ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, getInitials } from '../../../utils/helpers'
import { BLOG_CATEGORIES } from '../../../utils/constants'

const BlogCard = ({ article, index }) => {
  const category = BLOG_CATEGORIES[article.category.toLowerCase()]
  
  return (
    <article 
      className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover group animate-fade-in-up" 
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <Link to={`/blog/${article.id}`} className="block">
        {/* Imagen con overlay */}
        <div className="relative overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
          
          {/* Badge de categoría */}
          <div className="absolute bottom-4 left-4">
            <span className={`${category?.bgColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              {article.category}
            </span>
          </div>
          
          {/* Icono hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="p-8">
          {/* Meta información */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{article.readTime} de lectura</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
          </div>
          
          {/* Título */}
          <h3 className="text-2xl font-bold text-blue-900 group-hover:text-green-600 transition-colors duration-300 mb-4">
            {article.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {article.excerpt}
          </p>
          
          {/* Autor */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {getInitials(article.author)}
              </span>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">{article.author}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default BlogCard