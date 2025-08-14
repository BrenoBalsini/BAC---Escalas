import React, { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { FaBars, FaTimes } from 'react-icons/fa';

// Definimos os links em um array para facilitar a manutenção
const navLinks = [
  { to: '/generator', label: 'Gerar Escala' },
  { to: '/roster', label: 'Efetivo' },
  { to: '/posts', label: 'Postos' },
  { to: '/history', label: 'Histórico' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Função para aplicar classes dinamicamente, destacando o link ativo
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const commonClasses = 'px-3 py-2 rounded-md text-sm font-medium transition-colors block md:inline';
    if (isActive) {
      return `${commonClasses} text-blue-600 font-semibold bg-blue-100`;
    }
    return `${commonClasses} text-gray-500 hover:text-gray-900 hover:bg-gray-100`;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="shadow-md fixed top-0 left-0 w-full z-50 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-lg text-gray-800">
            <Link to="/" onClick={closeMobileMenu}>
              BAC
            </Link>
          </div>

          {/* Navegação para Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Botão do Menu Móvel */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menu</span>
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Móvel (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center border-t border-gray-200">
            {navLinks.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={getNavLinkClass} 
                onClick={closeMobileMenu} // Fecha o menu ao clicar em um link
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;