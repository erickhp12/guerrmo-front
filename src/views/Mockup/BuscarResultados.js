import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';
import config from '../../config.js';
import SearchBar from '../../components/SearchBar';
import Navbar from '../../components/Navbar';

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-48" /></td>
    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-28" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16 ml-auto" /></td>
    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-6 bg-gray-200 rounded-full w-20 ml-auto" /></td>
    <td className="px-4 py-3"><div className="h-7 bg-gray-200 rounded-lg w-16 mx-auto" /></td>
  </tr>
);

const BuscarResultados = () => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search).get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('relevancia');

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(false);
    fetch(`${config.API_URL}/articles/0/clave/${encodeURIComponent(query.trim())}`)
      .then(r => r.json())
      .then(data => {
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
        setSearched(true);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
        setSearched(true);
      });
  }, [query]);

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'precio-asc') return Number(a.precio) - Number(b.precio);
    if (sortBy === 'precio-desc') return Number(b.precio) - Number(a.precio);
    return 0;
  });

  const handleSearch = (term) => {
    history.push(`/buscar?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search bar section */}
      <div className="bg-gray-700 py-5 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SearchBar
            placeholder="Buscar por clave, descripción, marca..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Inicio</Link>
              <span>/</span>
              <span className="text-gray-900 truncate">
                {query ? `Resultados para "${query}"` : 'Búsqueda'}
              </span>
            </div>
            {searched && !loading && (
              <span className="text-xs sm:text-sm text-gray-500 shrink-0">
                {results.length.toLocaleString()} resultado{results.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!query.trim() ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">Escribe algo para buscar</p>
            <p className="text-gray-400 text-sm mt-2">Puedes buscar por clave, clave alterna o descripción</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">
                {loading
                  ? 'Buscando...'
                  : searched
                    ? `${results.length.toLocaleString()} resultado${results.length !== 1 ? 's' : ''} para "${query}"`
                    : ''
                }
              </h2>
              {!loading && results.length > 0 && (
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Precio ↑</option>
                  <option value="precio-desc">Precio ↓</option>
                </select>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left">Clave</th>
                    <th className="px-3 sm:px-4 py-3 text-left">Descripción</th>
                    <th className="px-3 sm:px-4 py-3 text-left hidden sm:table-cell">Características</th>
                    <th className="px-3 sm:px-4 py-3 text-right">Precio</th>
                    <th className="px-3 sm:px-4 py-3 text-right hidden sm:table-cell">Existencia</th>
                    <th className="px-3 sm:px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : sorted.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-16 text-center">
                        <p className="text-4xl mb-4">😕</p>
                        <p className="text-gray-500 text-base font-medium">Sin resultados para "{query}"</p>
                        <p className="text-gray-400 text-sm mt-2">Intenta con otra clave o descripción más corta</p>
                        <Link
                          to="/catalogo"
                          className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Explorar catálogo
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    sorted.map((product, index) => {
                      const existencia = Number(product.existenciaHenequen || 0) + Number(product.existenciaMezquital || 0);
                      const enStock = existencia > 0;
                      return (
                        <tr
                          key={product.clave + index}
                          className={`hover:bg-blue-50 transition ${!enStock ? 'opacity-60' : ''}`}
                        >
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                            <span className="font-mono text-gray-700 text-xs">{product.clave}</span>
                            {product.claveAlterna && product.claveAlterna !== product.clave && (
                              <p className="font-mono text-gray-400 text-xs mt-0.5">{product.claveAlterna}</p>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-900 font-medium">
                            <span className="line-clamp-2 sm:line-clamp-none">{product.descripcion}</span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-500 text-xs hidden sm:table-cell max-w-xs">{product.caracteristicas}</td>
                          <td className="px-3 sm:px-4 py-3 text-right font-bold text-blue-600 whitespace-nowrap text-xs sm:text-sm">
                            ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-right hidden sm:table-cell">
                            {enStock ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
                                {existencia.toLocaleString()} pzas
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600 whitespace-nowrap">
                                Sin stock
                              </span>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <Link
                              to={`/producto/${product.clave}`}
                              className="bg-gray-700 text-white px-3 py-2.5 rounded-lg hover:bg-gray-900 transition text-xs font-semibold whitespace-nowrap min-h-[44px] flex items-center"
                            >
                              Ver →
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer minimal */}
      <footer className="bg-gray-900 text-gray-400 text-center text-xs py-6 mt-16">
        <p>&copy; 2024 Guerrmo. Refacciones automotrices en Ciudad Juárez.</p>
      </footer>
    </div>
  );
};

export default BuscarResultados;
