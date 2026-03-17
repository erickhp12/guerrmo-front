import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';
import config from '../../config.js';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${config.API_URL}/articles/product/0/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('guerrmo_cart') || '[]');
    const existing = cart.find(item => item.clave === product.clave);
    if (existing) {
      localStorage.setItem('guerrmo_cart', JSON.stringify(
        cart.map(item => item.clave === product.clave ? { ...item, quantity: item.quantity + quantity } : item)
      ));
    } else {
      localStorage.setItem('guerrmo_cart', JSON.stringify([...cart, { ...product, quantity }]));
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-xl text-gray-600">Producto no encontrado</p>
        <Link to="/catalogo" className="text-blue-600 hover:underline">← Volver al catálogo</Link>
      </div>
    );
  }

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
            <Link to="/pedido" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Ver Pedido
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Inicio</Link>
              <span>/</span>
              <Link to="/catalogo" className="hover:text-blue-600">Catálogo</Link>
              <span>/</span>
              <span className="text-gray-900">{product.descripcion}</span>
            </div>
            <Link
              to="/catalogo"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ← Regresar al catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: info principal */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.departamento}
                </span>
                <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {product.categoria}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{product.descripcion}</h1>

              <div className="flex gap-6 text-sm text-gray-500">
                <span>Clave: <span className="font-mono font-semibold text-gray-700">{product.clave}</span></span>
                {product.claveAlterna && product.claveAlterna !== product.clave && (
                  <span>Clave alterna: <span className="font-mono font-semibold text-gray-700">{product.claveAlterna}</span></span>
                )}
              </div>

              {product.caracteristicas && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">🔧 Características</p>
                  <p className="text-sm text-blue-700">{product.caracteristicas}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-4xl font-bold text-blue-600">
                    ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-gray-500">MXN</span>
                </div>
                <p className={`text-sm font-medium ${product.existencia > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.existencia > 0 ? `✓ ${product.existencia} unidades en existencia` : '✗ Sin existencia'}
                </p>
                {product.disponible > 0 && (
                  <p className="text-sm text-gray-500 mt-1">{product.disponible} disponibles para entrega</p>
                )}
              </div>

              {/* Cantidad + agregar */}
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Cantidad:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                  <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
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

              <div className="grid grid-cols-3 gap-4 text-center mt-2">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl mb-1">🚚</div>
                  <p className="text-xs text-gray-600">Entrega a domicilio</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl mb-1">✓</div>
                  <p className="text-xs text-gray-600">Garantía incluida</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl mb-1">💬</div>
                  <p className="text-xs text-gray-600">Asesoría gratis</p>
                </div>
              </div>
            </div>

            {/* Right: tabla de datos */}
            <div className="bg-gray-50 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Información del producto</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  {[
                    ['Clave', product.clave],
                    ['Clave alterna', product.claveAlterna],
                    ['Departamento', product.departamento],
                    ['Categoría', product.categoria],
                    ['Características', product.caracteristicas],
                    ['Existencia', product.existencia],
                    ['Disponible', product.disponible],
                  ].map(([label, value]) => value != null && (
                    <tr key={label}>
                      <td className="py-2 pr-4 text-gray-500 font-medium whitespace-nowrap">{label}</td>
                      <td className="py-2 text-gray-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
