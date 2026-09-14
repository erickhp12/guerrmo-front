import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';
const noImage = 'https://guerrmo-store.s3.us-east-1.amazonaws.com/general/default-image.png';
import config from '../../config.js';
import { getProfile, apiFetch } from '../../utils.js';
import Navbar from '../../components/Navbar';
import SEO from '../../components/SEO';
import { trackAddToCart } from '../../analytics';
import { FaWhatsapp } from 'react-icons/fa';
import { SucursalDialog, buildWhatsAppLink } from '../../components/WhatsAppButton';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  useEffect(() => {
    const priceTier = getProfile()?.price ?? 1;
    fetch(`${config.API_URL}/articles/product/${priceTier}/${id}`)
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

  const buildWhatsAppMessage = () => {
    const precio = Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 });
    const stockLines = Array.isArray(product.stock) && product.stock.length > 0
      ? product.stock.map(s => `  • ${s.sucursal}: ${s.existencia > 0 ? `${Number(s.existencia).toLocaleString()} pzas` : 'Sin existencia'}`).join('\n')
      : '⚠️ Consultar disponibilidad';
    const extras = product.caracteristicas ? `\n🔧 ${product.caracteristicas}` : '';
    return (
      `¡Hola! Me interesa esta pieza:\n\n` +
      `📦 *${product.descripcion}*\n` +
      `🔑 Clave: ${product.clave}\n` +
      `💰 Precio: $${precio} MXN\n` +
      `📦 Existencia por sucursal:\n${stockLines}${extras}\n\n` +
      `¿Pueden confirmarme disponibilidad y tiempo de entrega?`
    );
  };

  const handleSelectSucursal = (sucursal) => {
    setWhatsAppOpen(false);
    window.open(
      buildWhatsAppLink(sucursal.phone, buildWhatsAppMessage()),
      '_blank',
      'noopener,noreferrer',
    );
  };

  const addToCart = async () => {
    const profile = getProfile();
    if (!profile || profile.client_id === 0) return;
    try {
      const res = await apiFetch(`${config.API_URL}/articles/add-article/`, {
        method: 'POST',
        body: JSON.stringify({
          article: product.clave,
          client: profile.client_id,
          price: product.precio,
          description: product.descripcion,
          features: product.caracteristicas || '',
          qty: quantity,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.error('Error al agregar al carrito:', data.message);
        return;
      }
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      return;
    }
    trackAddToCart({ clave: product.clave, descripcion: product.descripcion, precio: product.precio, quantity });
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

  const hasStock = Array.isArray(product.stock) && product.stock.some(s => s.existencia > 0);

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.descripcion,
    "description": product.caracteristicas || product.descripcion,
    "sku": product.clave,
    "brand": {
      "@type": "Brand",
      "name": "Guerrmo"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "MXN",
      "price": Number(product.precio),
      "availability": hasStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Guerrmo"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        pageTitle={`${product.descripcion} — Guerrmo Refacciones Ciudad Juárez`}
        description={`Compra ${product.descripcion} en Guerrmo, refacciones automotrices en Ciudad Juárez. Clave: ${product.clave}${product.caracteristicas ? `. ${product.caracteristicas}` : ''}. ${hasStock ? 'En existencia' : 'Consultar disponibilidad'}.`}
        structuredData={productStructuredData}
      />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 min-w-0">
              <Link to="/" className="hover:text-blue-600 shrink-0">Inicio</Link>
              <span className="shrink-0">/</span>
              <Link to="/catalogo" className="hover:text-blue-600 shrink-0">Catálogo</Link>
              <span className="shrink-0">/</span>
              <span className="text-gray-900 truncate">{product.descripcion}</span>
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
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-gray-500">MXN</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Disponibilidad por sucursal
                  </p>
                  {Array.isArray(product.stock) && product.stock.length > 0 ? (
                    <div className="space-y-2">
                      {product.stock.map(s => (
                        <div key={s.sucursal} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.existencia > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                            <span className="text-sm text-gray-700 font-medium">{s.sucursal}</span>
                          </div>
                          {s.existencia > 0 ? (
                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              {Number(s.existencia).toLocaleString()} pzas
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                              Sin existencia
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Consultando disponibilidad…</p>
                  )}
                </div>
              </div>

              {/* Cantidad + agregar */}
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Cantidad:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center">-</button>
                  <span className="px-6 py-3 border-x border-gray-300">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 active:scale-95 transition-all font-semibold text-lg"
                >
                  {added ? '✓ Agregado al pedido' : 'Agregar al pedido'}
                </button>
                <Link
                  to="/pedido"
                  className="flex-1 sm:flex-none bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-900 active:scale-95 transition-all font-semibold text-lg text-center"
                >
                  Ver pedido
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setWhatsAppOpen(true)}
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white px-8 py-4 rounded-lg transition-all font-semibold text-base"
              >
                <FaWhatsapp size={22} />
                Quiero más información de esta pieza por WhatsApp
              </button>

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
                  ].map(([label, value]) => value != null && (
                    <tr key={label}>
                      <td className="py-2 pr-4 text-gray-500 font-medium whitespace-nowrap">{label}</td>
                      <td className="py-2 text-gray-800">{value}</td>
                    </tr>
                  ))}
                  {Array.isArray(product.stock) && product.stock.map(s => (
                    <tr key={`stock-${s.sucursal}`}>
                      <td className="py-2 pr-4 text-gray-500 font-medium whitespace-nowrap">Existencia {s.sucursal}</td>
                      <td className={`py-2 font-semibold ${s.existencia > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {s.existencia > 0 ? Number(s.existencia).toLocaleString() : 'Sin existencia'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <SucursalDialog
        open={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        onSelect={handleSelectSucursal}
        title="¿Con qué sucursal deseas contactarte?"
        subtitle="Selecciona la sucursal a la que quieres enviarle la información de esta pieza."
      />
    </div>
  );
};

export default ProductoDetalle;
