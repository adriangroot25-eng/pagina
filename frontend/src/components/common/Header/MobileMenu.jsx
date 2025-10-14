import PropTypes from 'prop-types';
import NavLink from './NavLink';

const MobileMenu = ({ isOpen, onClose, navigationItems }) => {
  if (!isOpen) return null;

  const handleNavClick = () => {
    onClose();
  };

  return (
    <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t animate-fade-in-up">
      <ul className="flex flex-col py-4">
        {navigationItems.map((item) => (
          <li key={item.id}>
            <NavLink
              href={`#${item.id}`}
              onClick={handleNavClick}
              isMobile={true}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="px-6 pb-4">
        <button 
          onClick={() => {
            const element = document.getElementById('contacto');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
            onClose();
          }}
          className="w-full px-6 py-3 btn-primary text-white rounded-full font-semibold shadow-lg"
        >
          Agendar Cita
        </button>
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  navigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
};

export default MobileMenu;