import { useState, useEffect } from 'react'
import PackagesSection from '../components/sections/Reservations/PackagesSection'
import ReservationForm from '../components/forms/ReservationForm/ReservationForm'

const Reservations = () => {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg)
    // Mostrar el formulario después de seleccionar paquete
    setTimeout(() => {
      setShowForm(true)
    }, 500)
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
        <div id="reservation-form">
          <ReservationForm 
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