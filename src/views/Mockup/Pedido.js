import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';
const noImage = 'https://guerrmo-store.s3.us-east-1.amazonaws.com/general/no-image.svg';
import Navbar from '../../components/Navbar';
const Pedido = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('guerrmo_cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = cart.map(item => 
      item.id === productId ? {...item, quantity: newQuantity} : item
    );
    setCart(updated);
    localStorage.setItem('guerrmo_cart', JSON.stringify(updated));
  };

  const removeItem = (productId) => {
    const updated = cart.filter(item => item.id !== productId);
    setCart(updated);
    localStorage.setItem('guerrmo_cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.removeItem('guerrmo_cart');
    setCart([]);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Enviado!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Tu solicitud fue enviada exitosamente. Nos pondremos en contacto contigo en las próximas 2 horas para confirmar tu pedido y coordinar la entrega.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="text-sm text-blue-900">
                <strong>Datos de contacto:</strong><br/>
                {formData.name}<br/>
                {formData.phone}<br/>
                {formData.email}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold">
                Volver al Inicio
              </Link>
              <Link to="/catalogo" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold">
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Mi Pedido</h1>
          <p className="text-red-100">Revisa tu pedido y completa tus datos para continuar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu pedido está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega productos desde nuestro catálogo</p>
            <Link to="/catalogo" className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold">
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos en tu pedido</h2>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 p-4 border border-gray-200 rounded-xl">
                      <img
                        src={item.image || noImage}
                        alt={item.name || 'Producto'}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
                        onError={e => { e.target.src = noImage; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">${item.price}</p>
                      </div>
                      <div className="flex flex-col justify-between items-end shrink-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium min-h-[44px] flex items-center"
                        >
                          Eliminar
                        </button>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2.5 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="px-4 py-2.5 border-x border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2.5 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
                
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="442-123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de entrega *
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Calle, número, colonia, ciudad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentarios adicionales
                    </label>
                    <textarea
                      value={formData.comments}
                      onChange={(e) => setFormData({...formData, comments: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Horario preferido, referencias, etc."
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <strong>Nota:</strong> Este es un pedido sin pago en línea. Te contactaremos para confirmar disponibilidad y coordinar la entrega.
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg"
                  >
                    Enviar Pedido
                  </button>
                </form>
              </div>
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

export default Pedido;
