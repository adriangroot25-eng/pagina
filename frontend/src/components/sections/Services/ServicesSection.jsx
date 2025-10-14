import { HeartPulse, Dumbbell, Brain, Apple } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { MEDICAL_SERVICES, ANIMATION_CONFIG } from '../../../utils/constants';

// Mapeo de iconos por nombre
const ICON_MAP = {
  HeartPulse,
  Dumbbell, 
  Brain,
  Apple
};

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-20 bg-white fade-in-section">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-blue-900 mb-6">
          Nuestros Servicios
        </h2>
        <p className="text-xl mb-16 max-w-4xl mx-auto text-gray-600 font-light">
          Ofrecemos un enfoque integral para tu salud y rendimiento, combinando 
          cuatro áreas clave de especialización médica deportiva.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MEDICAL_SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              icon={ICON_MAP[service.icon]}
              title={service.title}
              description={service.description}
              color={service.color}
              delay={`${index * 0.2}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;