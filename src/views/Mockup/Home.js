import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockProducts } from '../../mockData';
import logo from '../../assets/img/miniLogo.png';
import config from '../../config.js';
import SearchBar from '../../components/SearchBar';

const Home = () => {
  const featuredProducts = mockProducts.slice(0, 6);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.API_URL}/articles/categories/`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const formattedCategories = data.data.slice(0, 10).map(cat => ({
            id: cat.id,
            name: cat.departamento,
            icon: cat.imagen || '🔧',
            count: cat.total
          }));
          setCategories(formattedCategories);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

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
              <Link to="/catalogo" className="text-gray-700 hover:text-blue-600 font-medium">Catálogo</Link>
              <Link to="/pedido" className="text-gray-700 hover:text-blue-600 font-medium">Mi Pedido</Link>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
            </nav>
            <Link to="/pedido" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              Ver Pedido
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-300 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">
                ¿Qué pieza estás buscando?
              </h1>
              <p className="text-xl mb-1 font-bold">
                Solicita tus productos en línea y recíbelos en tu domicilio.
              </p>
              <p className="text-md mb-8 text-white">
                Refacciones de calidad en Ciudad Juárez.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalogo" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-center">
                  Ver catálogo
                </Link>
                <a href="#como-funciona" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-center">
                  ¿Cómo funciona?
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-700 font-semibold mb-3 text-sm">Busca tu refacción</p>
                  <SearchBar placeholder="Balatas, filtros, baterías, bujías..." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Categorías destacadas</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando categorías...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {categories.map(cat => (
                <Link 
                  key={cat.id}
                  to={`/catalogo?category=${cat.name}`}
                  className="bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-600 rounded-xl p-6 text-center transition group"
                >
                  <div className="text-4xl mb-3">
                    <img className='max-h-30 max-w-20' src={cat.icon.includes('http') ? cat.icon : cat.icon}
                    /></div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.count} productos</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Productos Destacados (pendiente)</h2>
            <Link to="/catalogo" className="text-blue-600 hover:text-blue-700 font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-lg mt-3 text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">{product.brand}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <Link 
                      to={`/producto/${product.id}`}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">¿Por qué elegir Guerrmo?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Atención Local</h3>
              <p className="text-gray-600">Servicio personalizado en Ciudad Juárez con más de 10 años de experiencia</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega a Domicilio</h3>
              <p className="text-gray-600">Llevamos tus refacciones donde las necesites</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Amplio Catálogo</h3>
              <p className="text-gray-600">Miles de refacciones para todas las marcas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Respuesta Rápida</h3>
              <p className="text-gray-600">Confirmamos tu pedido en menos de 2 horas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="font-bold text-xl mb-3">Busca tu refacción</h3>
                <p className="text-gray-600">Explora nuestro catálogo o usa el buscador para encontrar lo que necesitas</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="font-bold text-xl mb-3">Haz tu pedido</h3>
                <p className="text-gray-600">Agrega productos y completa el formulario con tus datos de contacto</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="font-bold text-xl mb-3">Recibe en tu domicilio</h3>
                <p className="text-gray-600">Te contactamos para confirmar disponibilidad y coordinar la entrega</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cobertura Local */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Refacciones en Ciudad Juárez</h2>
          <Link to="/catalogo" className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Solicita tu Pedido Ahora
          </Link>
        </div>
      </section>

      {/* Roadmap de Crecimiento */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Cómo puede crecer tu sitio en los próximos meses</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Visión de evolución del sistema para maximizar tu presencia digital y ventas
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-600 mb-2">MES 1-3 • ACTUAL</div>
              <h3 className="font-bold text-lg mb-3">Fase Inicial</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ SEO local optimizado</li>
                <li>✓ Catálogo completo en línea</li>
                <li>✓ Sistema de pedidos sin pago</li>
                <li>✓ Panel administrativo básico</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
              <div className="text-sm font-bold text-orange-600 mb-2">MES 4-5 • PRÓXIMO</div>
              <h3 className="font-bold text-lg mb-3">Fase de Crecimiento</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Historial de pedidos</li>
                <li>• Clientes frecuentes</li>
                <li>• SEO por marcas y categorías</li>
                <li>• Notificaciones automáticas</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-600 mb-2">MES 6+ • FUTURO</div>
              <h3 className="font-bold text-lg mb-3">Fase Avanzada</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Seguimiento de pedidos en tiempo real</li>
                <li>• Reportes y analytics</li>
                <li>• App móvil (opcional)</li>
                <li>• Integración con inventario</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
                  <li key={cat.id}><Link to={`/catalogo?category=${cat.name}`} className="hover:text-white">{cat.name}</Link></li>
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
            <p>&copy; 2026 Guerrmo. Refacciones automotrices en Ciudad Juárez. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
