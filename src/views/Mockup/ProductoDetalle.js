import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockProducts } from '../../mockData';
import logo from '../../assets/img/miniLogo.png';

const ProductoDetalle = () => {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600">Producto no encontrado</p>
    </div>;
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('guerrmo_cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      const updated = cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + quantity} : item
      );
      localStorage.setItem('guerrmo_cart', JSON.stringify(updated));
    } else {
      localStorage.setItem('guerrmo_cart', JSON.stringify([...cart, {...product, quantity}]));
    }
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-lg font-medium"> Inicio</span>
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

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-blue-600">Catálogo</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img src={product.image} alt={product.name} className="w-full h-96 object-cover" />
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-2">{product.brand}</p>
            <p className="text-sm text-gray-500 mb-6">SKU: {product.sku}</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                <span className="text-sm text-gray-500">MXN</span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                {product.stock > 0 ? `✓ ${product.stock} unidades disponibles` : 'Consultar disponibilidad'}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.compatibility && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-sm text-blue-900 mb-2">🔧 Compatibilidad</h3>
                <p className="text-sm text-blue-800">{product.compatibility}</p>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <label className="font-medium text-gray-700">Cantidad:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={addToCart}
                className="flex-1 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-semibold text-lg"
              >
                {added ? '✓ Agregado al pedido' : 'Agregar al pedido'}
              </button>
              <Link
                to="/pedido"
                className="bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-900 transition font-semibold text-lg"
              >
                Ver pedido
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">🚚</div>
                <p className="text-xs text-gray-600">Entrega a domicilio</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">✓</div>
                <p className="text-xs text-gray-600">Garantía incluida</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-xs text-gray-600">Asesoría gratis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map(related => (
                <div key={related.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                  <Link to={`/producto/${related.id}`}>
                    <img src={related.image} alt={related.name} className="w-full h-48 object-cover" />
                  </Link>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {related.category}
                    </span>
                    <Link to={`/producto/${related.id}`}>
                      <h3 className="font-bold text-lg mt-3 text-gray-900 hover:text-blue-600">{related.name}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mt-2">{related.brand}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-blue-600">${related.price}</span>
                      <Link 
                        to={`/producto/${related.id}`}
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
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
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

export default ProductoDetalle;
