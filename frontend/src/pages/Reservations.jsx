import { useState, useEffect } from 'react'
import PackagesSection from '../components/sections/Reservations/PackagesSection'
import SimpleReservationForm from '../components/forms/SimpleReservationForm'

const Reservations = () => {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg)
    setShowForm(true)

    // Scroll suave hacia el formulario después de que se renderice
    setTimeout(() => {
      const element = document.getElementById("reservation-form")
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-0">

      {/* Sección de paquetes */}
      <PackagesSection 
        onPackageSelect={handlePackageSelect}
        selectedPackage={selectedPackage}
      />

      {/* Formulario de reserva */}
      {showForm && selectedPackage && (
        <div id="reservation-form" className="py-12">
          <SimpleReservationForm
            selectedPackage={selectedPackage}
            onBack={() => {
              setShowForm(false)
              setSelectedPackage(null)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Reservations