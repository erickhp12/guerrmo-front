import React, { useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import logo from '../assets/img/miniLogo.png';
import { getProfile, logout } from '../utils.js';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const profile = getProfile();
  const isGuest = profile.is_guest === true;
  const isAdmin = profile.is_admin === true;

  const handleSucursales = (e) => {
    e.preventDefault();
    setOpen(false);
    history.push('/sucursales');
  };

  const handleLogout = () => {
    logout();
    // initSession se llama en el App wrapper al recargar, pero forzamos recarga
    window.location.reload();
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
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8">
            <NavLink exact to="/" activeClassName={navLinkActive} className={navLinkClass}>
              Inicio
            </NavLink>
            {!isAdmin && (
              <>
                <NavLink to="/catalogo" activeClassName={navLinkActive} className={navLinkClass}>
                  Catálogo
                </NavLink>
                <a href="#sucursales" onClick={handleSucursales} className={`${navLinkClass} cursor-pointer`}>
                  Sucursales
                </a>
                <NavLink to="/pedido" activeClassName={navLinkActive} className={navLinkClass}>
                  Mi Pedido
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" activeClassName={navLinkActive} className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Indicador de sesion */}
            {isGuest ? (
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <FiUser size={14} />
                <span>Invitado</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <FiUser size={14} />
                <span className="max-w-[120px] truncate">{profile.name}</span>
              </div>
            )}

            {/* Boton login / logout */}
            {isGuest ? (
              <Link
                to="/login"
                onClick={close}
                className="hidden sm:flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all font-medium text-sm min-h-[10px]"
              >
                <FiLogIn size={18} />
                <span>Iniciar sesión</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all font-medium text-sm min-h-[20px]"
              >
                <FiLogOut size={18} />
                <span>Salir</span>
              </button>
            )}

            {/* Carrito */}
            {!isAdmin && (
              <Link
                to="/pedido"
                onClick={close}
                className="bg-gray-700 text-white px-4 py-1 rounded-lg hover:bg-gray-900 active:scale-95 transition-all font-semibold flex items-center gap-2 min-h-[14px]"
              >
                <FiShoppingCart size={18} />
                <span className="hidden sm:inline">Carrito</span>
              </Link>
            )}

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
            {!isAdmin && (
              <>
                <NavLink to="/catalogo" onClick={close} activeClassName={mobileNavLinkActive} className={mobileNavLinkClass}>
                  Catálogo
                </NavLink>
                <a href="#sucursales" onClick={handleSucursales} className={`${mobileNavLinkClass} cursor-pointer`}>
                  Sucursales
                </a>
                <NavLink to="/pedido" onClick={close} activeClassName={mobileNavLinkActive} className={mobileNavLinkClass}>
                  Mi Pedido
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" onClick={close} activeClassName={mobileNavLinkActive} className={mobileNavLinkClass}>
                Admin
              </NavLink>
            )}
            <div className="border-t border-gray-100 pt-2 mt-1">
              {isGuest ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
                    <FiUser size={14} />
                    <span>Sesión: Invitado</span>
                  </div>
                  <Link
                    to="/login"
                    onClick={close}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 font-medium text-sm"
                  >
                    <FiLogIn size={16} />
                    Iniciar sesión
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-green-700">
                    <FiUser size={14} />
                    <span>Sesión: {profile.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm"
                  >
                    <FiLogOut size={16} />
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
