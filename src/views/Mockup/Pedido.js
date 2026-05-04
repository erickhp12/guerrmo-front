import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const noImage = 'https://guerrmo-store.s3.us-east-1.amazonaws.com/general/no-image.svg';
import Navbar from '../../components/Navbar';
import config from '../../config.js';
import { getProfile, apiFetch } from '../../utils.js';

const emptyForm = {
  nombre: '',
  telefono: '',
  correo: '',
  calle: '',
  noExt: '',
  noInt: '',
  colonia: '',
  localidad: '',
  codigoPostal: '',
};

const Pedido = () => {
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loadCart = async () => {
    const profile = getProfile();
    if (!profile || profile.client_id === 0) {
      setCart([]);
      setLoadingCart(false);
      return;
    }
    try {
      const res = await apiFetch(`${config.API_URL}/articles/cart/${profile.client_id}`);
      const data = await res.json();
      if (!data.error && data.data && data.data.items) {
        setCart(data.data.items);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error('Error cargando carrito:', err);
      setCart([]);
    }
  };

  const prefillForm = async () => {
    const profile = getProfile();
    if (!profile || profile.is_guest || profile.client_id === 0) return;
    try {
      const res = await fetch(`${config.API_URL}/clients/prefill/${profile.client_id}/`);
      const data = await res.json();
      if (!data.error && data.data) {
        setFormData(prev => ({ ...prev, ...data.data }));
      }
    } catch (err) {
      console.error('Error precargando datos:', err);
    }
  };

  useEffect(() => {
    Promise.all([
      loadCart(),
      prefillForm(),
    ]).finally(() => setLoadingCart(false));
  }, []);

  const updateQuantity = async (artId, newQty) => {
    if (newQty < 1) return;
    const profile = getProfile();
    try {
      await apiFetch(`${config.API_URL}/articles/modify-qty/`, {
        method: 'PUT',
        body: JSON.stringify({ client_id: profile.client_id, art_id: artId, qty: newQty }),
      });
      await loadCart();
    } catch (err) {
      console.error('Error al modificar cantidad:', err);
    }
  };

  const removeItem = async (artId) => {
    const profile = getProfile();
    try {
      await apiFetch(`${config.API_URL}/articles/delete/${artId}/client/${profile.client_id}`, {
        method: 'DELETE',
      });
      await loadCart();
    } catch (err) {
      console.error('Error al eliminar artículo:', err);
    }
  };

  const getItemKey = (item) => item.art_id;
  const getItemName = (item) => item.description || item.art_id;
  const getItemPrice = (item) => Number(item.price || 0);
  const getItemQty = (item) => item.qty || 1;

  const total = cart.reduce((sum, item) => sum + getItemPrice(item) * getItemQty(item), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    const profile = getProfile();
    try {
      const res = await apiFetch(`${config.API_URL}/articles/submit-order/`, {
        method: 'PUT',
        body: JSON.stringify({
          client_id: profile.client_id,
          form: formData,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setSubmitError(data.message || 'Error al enviar el pedido');
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      setSubmitError('Error de conexión. Intenta de nuevo.');
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setCart([]);
    setSubmitting(false);
  };

  const field = (key, e) => { const val = e.target.value; setFormData(prev => ({ ...prev, [key]: val })); };

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
                <strong>Datos de contacto:</strong><br />
                {formData.nombre}<br />
                {formData.telefono}<br />
                {formData.correo}
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

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Cargando pedido...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 to-slate-400 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Mi Pedido</h1>
          <p className="text-white-100">Revisa tu pedido y completa tus datos para continuar</p>
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
                    <div key={getItemKey(item)} className="flex gap-3 p-4 border border-gray-200 rounded-xl">
                      <img
                        src={item.image || noImage}
                        alt={getItemName(item)}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
                        onError={e => { e.target.src = noImage; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 text-wrap">{getItemName(item)}</h3>
                        {item.features && <p className="text-sm text-gray-600">{item.features}</p>}
                        <p className="text-sm text-gray-500">Clave: {getItemKey(item)}</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">
                          ${Number(getItemPrice(item)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between items-end shrink-0">
                        <button
                          onClick={() => removeItem(getItemKey(item))}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium min-h-[44px] flex items-center"
                        >
                          Eliminar
                        </button>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(getItemKey(item), getItemQty(item) - 1)}
                            className="px-3 py-2.5 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >-</button>
                          <span className="px-4 py-2.5 border-x border-gray-300">{getItemQty(item)}</span>
                          <button
                            onClick={() => updateQuantity(getItemKey(item), getItemQty(item) + 1)}
                            className="px-3 py-2.5 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >+</button>
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

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={e => field('nombre', e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={e => field('telefono', e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="6561234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.correo}
                      onChange={e => field('correo', e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calle *</label>
                    <input
                      type="text"
                      required
                      value={formData.calle}
                      onChange={e => field('calle', e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Av. Juárez"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número exterior *</label>
                      <input
                        type="text"
                        required
                        value={formData.noExt}
                        onChange={e => field('noExt', e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número exterior </label>
                      <input
                        type="text"
                        value={formData.noInt}
                        onChange={e => field('noInt', e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="A"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                    <input
                      type="text"
                      required
                      value={formData.colonia}
                      onChange={e => field('colonia', e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Centro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localidad *</label>
                    <input
                      type="text"
                      required
                      value={formData.localidad}
                      onChange={e => field('localidad', e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ciudad Juárez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código postal *</label>
                    <input
                      type="text"
                      required
                      value={formData.codigoPostal}
                      onChange={e => field('codigoPostal', e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="32000"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <strong>Nota:</strong> Este es un pedido sin pago en línea. Te contactaremos para confirmar disponibilidad y coordinar la entrega.
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg disabled:opacity-60"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Pedido'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

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
              <p className="text-gray-400 text-sm">Tu refaccionaria de confianza en Ciudad Juárez</p>
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
