import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';
import config from '../../config.js';

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetch(`${config.API_URL}/articles/categories/`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setCategories(data.data);
          setTotalProducts(data.data.reduce((sum, cat) => sum + cat.total, 0));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCategories = selectedCategory === 'Todas' 
    ? filteredCategories 
    : filteredCategories.filter(cat => cat.departamento === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
              <img src={logo} alt="Guerrmo" className="h-12 w-auto" />
              <span className="text-lg font-medium">Ir a Inicio</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Inicio</Link>
              <Link to="/catalogo" className="text-blue-600 font-medium">Catálogo</Link>
              <Link to="/pedido" className="text-gray-700 hover:text-blue-600 font-medium">Mi Pedido</Link>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
            </nav>
            <Link to="/pedido" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Ver Pedido
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gray-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Catálogo de Refacciones</h1>
          <p className="text-gray-200">Encuentra las mejores refacciones para tu vehículo en Ciudad Juárez</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              
              {/* Search */}
              <div className="mb-6">
                <label className="block font-bold text-lg text-gray-700 mb-2">Buscar categoría</label>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Categorías</label>
                {loading ? (
                  <p className="text-sm text-gray-500">Cargando...</p>
                ) : (
                  <div className="space-y-2 max-h-full overflow-y-auto">
                    <button
                      onClick={() => setSelectedCategory('Todas')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === 'Todas' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Todas ({totalProducts?.toLocaleString()})
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.departamento)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                          selectedCategory === cat.departamento 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.departamento} ({cat.total?.toLocaleString()})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="md:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Mostrando {displayCategories.length} categorías
              </p>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">Cargando categorías...</p>
              </div>
            ) : displayCategories.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">No se encontraron categorías</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCategories.map(cat => (
                  <div key={cat.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                    {cat.imagen && (
                      <img src={cat.imagen} alt={cat.departamento} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900">{cat.departamento}</h3>
                      <p className="text-sm text-gray-600 mt-2">{cat.total} productos disponibles</p>
                      
                      <div className="mt-4">
                        <Link
                          to={`/categoria/${cat.id}`}
                          className="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                        >
                          Ver productos
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="Guerrmo" className="h-10 w-auto" />
                <span className="text-xl font-bold">Guerrmo</span>
              </div>
              <p className="text-gray-400 text-sm">
                Tu refaccionaria de confianza en Ciudad Juárez
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navegación</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-white">Inicio</Link></li>
                <li><Link to="/catalogo" className="hover:text-white">Catálogo</Link></li>
                <li><Link to="/pedido" className="hover:text-white">Mi Pedido</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categorías</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {categories.slice(0, 4).map(cat => (
                  <li key={cat.id}><a href="#" className="hover:text-white">{cat.departamento}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 656-123-4567</li>
                <li>📧 contacto@guerrmo.com</li>
                <li>📍 Ciudad Juárez, Chih.</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Guerrmo. Refacciones automotrices en Ciudad Juárez. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Catalogo;
