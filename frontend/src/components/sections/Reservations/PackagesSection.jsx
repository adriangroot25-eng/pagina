import { useState, useEffect } from "react";
import { Shield, Clock, Star } from "lucide-react";
import PackageCard from "./PackageCard";
import { CONSULTATION_PACKAGES } from "../../../utils/constants";
import { WHATSAPP_CONFIG } from "../../../config/whatsapp";

const PackagesSection = ({ onPackageSelect, selectedPackage }) => {
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usar datos locales directamente (sin Supabase)
    setPackages(CONSULTATION_PACKAGES);
    setLoading(false);
  }, []);

  const handlePackageSelect = (pkg) => {
    onPackageSelect(pkg);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
            Elige tu Consulta
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Selecciona el paquete que mejor se adapte a tus necesidades. 
            Todas nuestras consultas incluyen atención personalizada con especialistas certificados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up animation-delay-200">
          <div className="text-center p-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Especialistas Certificados</h3>
            <p className="text-gray-600 text-sm">Médicos con certificaciones nacionales e internacionales</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Atención Puntual</h3>
            <p className="text-gray-600 text-sm">Respetamos tu tiempo con horarios exactos</p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Calidad Premium</h3>
            <p className="text-gray-600 text-sm">Instalaciones de primera clase y tecnología avanzada</p>
          </div>
        </div>

        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button 
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {packages.filter(pkg => !pkg.customizable).map((pkg, index) => (
                  <div 
                    key={pkg.id}
                    className="animate-fade-in-up h-full"
                    style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                    onMouseEnter={() => setHoveredPackage(pkg.id)}
                    onMouseLeave={() => setHoveredPackage(null)}
                  >
                    <PackageCard
                      package={pkg}
                      isSelected={selectedPackage?.id === pkg.id}
                      onSelect={handlePackageSelect}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          {CONSULTATION_PACKAGES.filter(pkg => pkg.customizable).map((pkg, index) => (
            <div 
              key={pkg.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(7 + index) * 0.1}s` }}
            >
              <div className="relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ✨ Más Popular
                  </span>
                </div>
                <PackageCard
                  package={pkg}
                  isSelected={selectedPackage?.id === pkg.id}
                  onSelect={handlePackageSelect}
                  isCustomizable={true}
                />
              </div>
            </div>
          ))}
        </div>


        <div className="mt-20 bg-white rounded-3xl shadow-xl p-8 lg:p-12 animate-fade-in-up animation-delay-800">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-900 mb-6">
              ¿Necesitas ayuda para elegir?
            </h3>
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
              Nuestro equipo está disponible para ayudarte a seleccionar el paquete ideal 
              según tus objetivos deportivos y de salud.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
              <a
                href={`tel:+${WHATSAPP_CONFIG.clinicNumber}`}
                className="flex items-center justify-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Llámanos</div>
                  <div className="text-gray-600">
                    {WHATSAPP_CONFIG.clinicNumber.replace(/^52/, '').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')}
                  </div>
                </div>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_CONFIG.clinicNumber}?text=${encodeURIComponent(WHATSAPP_CONFIG.welcomeMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">WhatsApp</div>
                  <div className="text-gray-600">Chat directo</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
