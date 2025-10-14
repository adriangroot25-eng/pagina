import React from 'react'

const sections = [
{ id: 'servicios', label: '1. Servicios ofrecidos' },
{ id: 'reservaciones', label: '2. Reservaciones y citas' },
{ id: 'uso', label: '3. Uso adecuado del sitio' },
{ id: 'proteccion', label: '4. Protección de datos personales' },
{ id: 'responsabilidad', label: '5. Responsabilidad médica' },
{ id: 'modificaciones', label: '6. Modificaciones a los términos' },
{ id: 'contacto', label: '7. Contacto' },
]

const TermsAndConditions = () => (
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
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Términos y Condiciones</h1>
        <p>
            Bienvenido a Sportiva. Al acceder y utilizar nuestro sitio web para la prestación de servicios médicos y la gestión de citas en línea, aceptas los siguientes términos y condiciones:
        </p>
        <h2 id="servicios" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">1. Servicios ofrecidos</h2>
        <p className="mb-4">
            Sportiva proporciona información sobre servicios médicos, permite la reserva de citas en línea y ofrece contenido relacionado con salud y bienestar. Los servicios médicos son prestados por profesionales certificados.
        </p>
        <h2 id="reservaciones" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">2. Reservaciones y citas</h2>
        <ul className="list-disc ml-6 mb-4">
            <li>Las citas pueden ser reservadas a través de nuestro sistema en línea, sujeto a disponibilidad.</li>
            <li>Es responsabilidad del usuario proporcionar información verídica y actualizada al momento de reservar.</li>
            <li>Sportiva se reserva el derecho de modificar o cancelar citas por motivos médicos, administrativos o de fuerza mayor. En caso de cambios, se notificará al usuario oportunamente.</li>
        </ul>
        <h2 id="uso" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">3. Uso adecuado del sitio</h2>
        <ul className="list-disc ml-6 mb-4">
            <li>El usuario se compromete a utilizar el sitio web de manera responsable y conforme a la ley.</li>
            <li>No está permitido el uso del sitio para actividades fraudulentas, ilegales o que puedan afectar el funcionamiento de los servicios.</li>
        </ul>
        <h2 id="proteccion" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">4. Protección de datos personales</h2>
        <p className="mb-4">
            La información personal proporcionada será tratada conforme a nuestro Aviso de Privacidad. Sportiva implementa medidas de seguridad para proteger los datos de los usuarios.
        </p>
        <h2 id="responsabilidad" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">5. Responsabilidad médica</h2>
        <p className="mb-4">
            Los servicios médicos ofrecidos a través de Sportiva son realizados por profesionales certificados. Sin embargo, la información proporcionada en el sitio web no sustituye la consulta médica presencial y personalizada.
        </p>
        <h2 id="modificaciones" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">6. Modificaciones a los términos</h2>
        <p className="mb-4">
            Sportiva se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las actualizaciones serán publicadas en esta página y entrarán en vigor desde su publicación.
        </p>
        <h2 id="contacto" className="text-xl font-semibold text-blue-900 mt-8 mb-2 scroll-mt-32">7. Contacto</h2>
        <p>
            Para dudas o aclaraciones sobre estos términos y condiciones, puedes contactarnos a través de los medios disponibles en la página.
        </p>
    </div>
    </div>
)

export default TermsAndConditions