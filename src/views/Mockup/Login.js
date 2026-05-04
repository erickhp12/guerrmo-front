import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import config from '../../config.js';
import { getProfile, apiFetch } from '../../utils.js';
import Navbar from '../../components/Navbar';

const Login = () => {
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const guestProfile = getProfile();
      const guestClientId = guestProfile.is_guest ? guestProfile.client_id : null;

      const res = await fetch(`${config.API_URL}/clients/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono, password }),
      });
      const data = await res.json();

      if (data.error) {
        setError('Teléfono o contraseña incorrectos');
        setLoading(false);
        return;
      }

      localStorage.setItem('profile', JSON.stringify({ ...data.data, is_guest: false }));

      // Migrar carrito del invitado al usuario real
      if (guestClientId && guestClientId !== data.data.client_id) {
        await migrateGuestCart(guestClientId, data.data.client_id);
      }

      history.push('/');
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    }
    setLoading(false);
  };

  const migrateGuestCart = async (guestId, realClientId) => {
    try {
      const res = await fetch(`${config.API_URL}/articles/cart/${guestId}`);
      const data = await res.json();
      if (data.error || !data.data || !data.data.items || data.data.items.length === 0) return;

      for (const item of data.data.items) {
        await fetch(`${config.API_URL}/articles/add-article/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            article: item.art_id,
            client: realClientId,
            price: item.price,
            description: item.description,
            features: item.features || '',
            qty: item.qty,
          }),
        });
      }
    } catch (err) {
      console.error('Error migrando carrito de invitado:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="text-gray-500 text-sm mt-2">
              Accede con tu cuenta para ver precios preferenciales
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 6561234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-60"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Continuar sin cuenta
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ¿No tienes cuenta? Comunícate con nosotros para obtener acceso.
        </p>
      </div>
    </div>
  );
};

export default Login;
