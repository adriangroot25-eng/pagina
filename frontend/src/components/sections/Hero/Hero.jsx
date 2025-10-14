import FloatingElements from './FloatingElements';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="inicio" 
      className="relative h-screen flex items-center justify-center text-white text-center overflow-hidden"
    >
      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
  src="/videohomepage.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
  {/* Overlay eliminado temporalmente para depuración */}
      
      {/* Elementos flotantes animados */}
      <FloatingElements />
      
      {/* Contenido principal */}
      <div className="relative z-10 p-6 animate-fade-in-up">
        <h2 className="text-lg md:text-xl uppercase tracking-widest text-green-200 font-light mb-4">
          "Tu salud en manos expertas"
        </h2>
        
        <h1 className="font-brand text-7xl md:text-9xl my-6 text-white text-shadow animate-scale-in animation-delay-300">
          Sportiva
        </h1>
        
        <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100 font-light mb-8 animate-fade-in-up animation-delay-600">
          Centro Integral Deportivo
        </p>
        
        <button 
          onClick={() => window.location.href = '/reservaciones'}
          className="btn-primary px-10 py-4 text-white rounded-full text-lg font-semibold shadow-2xl animate-fade-in-up animation-delay-900 hover-scale"
        >
          Agenda aquí
        </button>
      </div>
    </section>
  );
};

export default Hero;