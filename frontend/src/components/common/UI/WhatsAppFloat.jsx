import { MessageCircle } from 'lucide-react'
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from '../../../utils/constants'
import whatsappLogo from '../../../assets/logowhatsapp.png'

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const whatsappUrl = SOCIAL_LINKS.whatsapp(WHATSAPP_MESSAGES.default)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-float pulse-whatsapp"
      title="Contáctanos por WhatsApp"
      aria-label="Contactar por WhatsApp"
    >
         <img src={whatsappLogo} alt="WhatsApp" className="w-8 h-8 object-contain" />
    </button>
  )
}