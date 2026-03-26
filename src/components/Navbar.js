import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/img/miniLogo.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const handleSucursales = (e) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') {
      document.getElementById('sucursales')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#sucursales';
    }
  };

  const close = () => setOpen(false);

  const navLinkClass = 'text-gray-600 hover:text-blue-600 font-medium pb-1 transition-colors';
  const navLinkActive = 'text-blue-600 border-b-2 border-blue-600';
  const mobileNavLinkClass = 'block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors';
  const mobileNavLinkActive = 'bg-blue-50 text-blue-600';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center space-x-2">
            <img src={logo} alt="Guerrmo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">Guerrmo</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8">
            <NavLink exact to="/" activeClassName={navLinkActive} className={navLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" activeClassName={navLinkActive} className={navLinkClass}>
              Catálogo
            </NavLink>
            <a href="#sucursales" onClick={handleSucursales} className={`${navLinkClass} cursor-pointer`}>
              Sucursales
            </a>
            <NavLink to="/pedido" activeClassName={navLinkActive} className={navLinkClass}>
              Mi Pedido
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              to="/pedido"
              onClick={close}
              className="bg-gray-700 text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 active:scale-95 transition-all font-semibold flex items-center gap-2 min-h-[44px]"
            >
              <FiShoppingCart size={18} />
              <span className="hidden sm:inline">Carrito</span>
            </Link>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            >
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <nav className="md:hidden mt-2 pb-2 border-t border-gray-100 pt-2 flex flex-col gap-1">
            <NavLink exact to="/" onClick={close} activeClassName={mobileNavLinkActive} className={mobileNavLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" onClick={close} activeClassName={mobileNavLinkActive} className={mobileNavLinkClass}>
              Catálogo
            </NavLink>
            <a href="#sucursales" onClick={handleSucursales} className={`${mobileNavLinkClass} cursor-pointer`}>
              Sucursales
            </a>
            <NavLink to="/pedido" onClick={close} activeClassName={mobileNavLinkActive} className={mobileNavLinkClass}>
              Mi Pedido
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
