import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockProducts, categories } from '../../mockData';
import logo from '../../assets/img/miniLogo.png';

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [cart, setCart] = useState([]);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
    localStorage.setItem('guerrmo_cart', JSON.stringify(cart));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-lg font-medium"> Inicio</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium">Inicio</Link>
              <Link to="/catalogo" className="text-primary-600 font-medium">Catálogo</Link>
              <Link to="/pedido" className="text-gray-700 hover:text-primary-600 font-medium">Mi Pedido</Link>
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium">Admin</Link>
            </nav>
            <Link to="/pedido" className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-accent-700 transition relative">
              Ver Pedido
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Catálogo de Refacciones</h1>
          <p className="text-red-100">Encuentra las mejores refacciones para tu vehículo en Ciudad Juárez</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Filtros</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('Todas')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === 'Todas' 
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todas ({mockProducts.length})
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat.name 
                          ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Mostrando {filteredProducts.length} productos
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">No se encontraron productos</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                    <Link to={`/producto/${product.id}`}>
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    </Link>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <Link to={`/producto/${product.id}`}>
                        <h3 className="font-bold text-lg mt-3 text-gray-900 hover:text-primary-600">{product.name}</h3>
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
                      <p className="text-xs text-gray-500 mt-2">SKU: {product.sku}</p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                          <p className="text-xs text-green-600 mt-1">
                            {product.stock > 0 ? `${product.stock} disponibles` : 'Consultar'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Link 
                          to={`/producto/${product.id}`}
                          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-semibold text-center"
                        >
                          Ver detalle
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-accent-700 transition text-sm font-semibold"
                        >
                          Agregar
                        </button>
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
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
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
                <li><a href="#" className="hover:text-white">Frenos</a></li>
                <li><a href="#" className="hover:text-white">Suspensión</a></li>
                <li><a href="#" className="hover:text-white">Motor</a></li>
                <li><a href="#" className="hover:text-white">Filtros</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 442-123-4567</li>
                <li>📧 contacto@guerrmo.com</li>
                <li>📍 Ciudad Juárez, Qro.</li>
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
