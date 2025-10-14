import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlogCard from './BlogCard'
import { BLOG_ARTICLES } from '../../../utils/constants'

const BlogSection = () => {
  // Obtener solo los artículos destacados para la homepage
  const featuredArticles = BLOG_ARTICLES.filter(article => article.featured).slice(0, 3)

  return (
    <section id="blog" className="py-20 bg-gray-50 fade-in-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-blue-900 mb-6">
            Nuestro Blog
          </h2>
          <p className="text-xl max-w-4xl mx-auto text-gray-600 font-light leading-relaxed">
            Consejos y artículos de nuestros expertos para potenciar tu salud y rendimiento deportivo.
          </p>
        </div>
        
        {/* Grid de artículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredArticles.map((article, index) => (
            <BlogCard 
              key={article.id} 
              article={article} 
              index={index} 
            />
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in-up animation-delay-600">
          <Link 
            to="/blog" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver todos los artículos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection