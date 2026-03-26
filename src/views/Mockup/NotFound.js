import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <img src={logo} alt="Guerrmo" className="h-16 w-auto mb-6 opacity-80" />
      <h1 className="text-8xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Página no encontrada</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        La página que buscas no existe o fue movida. Pero tenemos miles de refacciones que sí podemos encontrarte.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all"
        >
          Ir al inicio
        </Link>
        <Link
          to="/catalogo"
          className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 active:scale-95 transition-all"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
