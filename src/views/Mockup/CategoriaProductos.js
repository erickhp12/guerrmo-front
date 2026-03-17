import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';
import config from '../../config.js';

const CategoriaProductos = () => {
  const { dep_id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${config.API_URL}/articles/articles-by-category/0/${dep_id}`).then(r => r.json()),
      fetch(`${config.API_URL}/articles/categories/`).then(r => r.json()),
    ]).then(([articlesData, categoriesData]) => {
      if (!articlesData.error) {
        setProducts(articlesData);
        if (articlesData.length > 0) setCategoryName(articlesData[0].departamento || '');
      }
      if (!categoriesData.error) {
        const cat = categoriesData.data.find(c => String(c.id) === String(dep_id));
        if (cat?.imagen) setCategoryImage(cat.imagen);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching data:', err);
      setLoading(false);
    });
  }, [dep_id]);

  const filtered = products.filter(p =>
    [p.clave, p.claveAlterna, p.descripcion, p.categoria, p.caracteristicas]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

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

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Inicio</Link>
              <span>/</span>
              <Link to="/catalogo" className="hover:text-blue-600">Catálogo</Link>
              <span>/</span>
              <span className="text-gray-900">{categoryName || 'Categoría'}</span>
            </div>
            <Link
              to="/catalogo"
              className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-400 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ← Regresar al catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gray-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
          {categoryImage && (
            <img
              src={categoryImage}
              alt={categoryName}
              className="h-32 w-32 rounded-md object-cover shadow-xl border-2 border-white/90"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{categoryName || 'Productos'}</h1>
            {!loading && <p className="text-gray-300 mt-1">{products?.length.toLocaleString()} productos encontrados</p>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No se encontraron productos en esta categoría</p>
            <Link to="/catalogo" className="mt-4 inline-block text-blue-600 hover:underline">← Volver al catálogo</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6">
            {/* Search bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-lg">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por clave, descripción, categoría..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {filtered.length} de {products.length} resultados
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Clave</th>
                    <th className="px-4 py-3 text-left">Descripción</th>
                    <th className="px-4 py-3 text-left">Categoría</th>
                    <th className="px-4 py-3 text-left">Características</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-right">Existencia</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((product, index) => (
                    <tr key={product.clave + index} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-mono text-gray-700 whitespace-nowrap">{product.clave}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{product.descripcion}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{product.categoria}</td>
                      <td className="px-4 py-3 text-gray-500">{product.caracteristicas}</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600 whitespace-nowrap">
                        ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{product.existencia}</td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/producto/${product.clave}`}
                          className="bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition text-xs font-semibold whitespace-nowrap"
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaProductos;
