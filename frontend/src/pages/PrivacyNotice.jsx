import React from 'react'

const sections = [
{ id: 'info', label: '1. Información que recopilamos' },
{ id: 'uso', label: '2. Uso de la información' },
{ id: 'proteccion', label: '3. Protección de datos' },
{ id: 'compartir', label: '4. Compartir información' },
{ id: 'derechos', label: '5. Derechos del usuario' },
{ id: 'cambios', label: '6. Cambios al aviso de privacidad' },
]

const PrivacyNotice = () => (
    <div className="container mx-auto py-16 px-4 flex flex-col md:flex-row">
    {/* Índice lateral */}
    <nav className="md:w-1/4 mb-8 md:mb-0 md:mr-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Ir a sección:</h2>
        <ul className="space-y-2">
            {sections.map(section => (
            <li key={section.id}>
                <a
                    href={`#${section.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                >
                {section.label}
                </a>
            </li>
        ))}
        </ul>
    </nav>
    {/* Contenido principal */}
    <div className="md:w-3/4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Avisos de Privacidad</h1>
        <p>
            En Sportiva, nos comprometemos a proteger la privacidad de nuestros usuarios. Este aviso de privacidad explica cómo recopilamos, usamos y protegemos la información personal que nos proporcionas a través de nuestra página web, dedicada a la prestación de servicios médicos y la gestión de citas en línea.
        </p>
        <h2 id="info" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">1. Información que recopilamos</h2>
        <ul className="list-disc ml-6 mb-4">
            <li>Datos personales: nombre, correo electrónico, teléfono y fecha de nacimiento.</li>
            <li>Información médica relevante para la prestación de nuestros servicios.</li>
            <li>Datos de citas: fecha, hora y tipo de servicio solicitado.</li>
        </ul>
        <h2 id="uso" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">2. Uso de la información</h2>
        <ul className="list-disc ml-6 mb-4">
            <li>Gestionar y confirmar tus citas médicas.</li>
            <li>Brindar atención personalizada y seguimiento médico.</li>
            <li>Comunicarnos contigo sobre actualizaciones, recordatorios y promociones relacionadas con nuestros servicios.</li>
        </ul>
        <h2 id="proteccion" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">3. Protección de datos</h2>
        <p className="mb-4">
            Implementamos medidas de seguridad administrativas y técnicas para proteger tu información personal contra accesos no autorizados, pérdida o alteración.
        </p>
        <h2 id="compartir" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">4. Compartir información</h2>
        <p className="mb-4">
            No compartimos tu información personal con terceros, salvo que sea necesario para la prestación de nuestros servicios médicos o por requerimiento legal.
        </p>
        <h2 id="derechos" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">5. Derechos del usuario</h2>
        <p className="mb-4">
            Tienes derecho a acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos, puedes contactarnos a través de nuestro formulario de contacto.
        </p>
        <h2 id="cambios" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">6. Cambios al aviso de privacidad</h2>
        <p>
            Nos reservamos el derecho de modificar este aviso de privacidad en cualquier momento. Las actualizaciones serán publicadas en esta página.
        </p>
        <p className="mt-8">
            Si tienes dudas sobre este aviso de privacidad, contáctanos a través de los medios disponibles en la página.
        </p>
    </div>
    </div>
)

export default PrivacyNotice