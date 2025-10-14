import { useEffect } from 'react'

/**
 * Hook personalizado para manejar animaciones de entrada con Intersection Observer
 * @param {string} selector - Selector CSS para los elementos a observar (default: '.fade-in-section')
 * @param {number} threshold - Umbral de visibilidad (0-1) (default: 0.15)
 * @param {string} activeClass - Clase a agregar cuando es visible (default: 'is-visible')
 */
export const useIntersectionAnimation = (
  selector = '.fade-in-section', 
  threshold = 0.15, 
  activeClass = 'is-visible'
) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(activeClass)
        }
      })
    }, {
      threshold,
      rootMargin: '0px 0px -50px 0px' // Activar un poco antes de que sea visible
    })

    // Observar elementos existentes
    const elements = document.querySelectorAll(selector)
    elements.forEach(element => observer.observe(element))

    // Cleanup
    return () => {
      elements.forEach(element => observer.unobserve(element))
    }
  }, [selector, threshold, activeClass])
}

export default useIntersectionAnimation
