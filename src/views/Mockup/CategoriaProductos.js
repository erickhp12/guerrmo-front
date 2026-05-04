import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import logo from '../../assets/img/miniLogo.png';
const noImage = 'https://guerrmo-store.s3.us-east-1.amazonaws.com/general/no-image.svg';
import config from '../../config.js';
import Navbar from '../../components/Navbar';

const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-3 animate-pulse flex flex-col gap-2">
    <div className="h-3 bg-gray-200 rounded w-1/2" />
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-5 bg-gray-200 rounded-full w-1/3 mt-1" />
    <div className="flex justify-between items-center mt-2">
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-200 rounded-full w-1/4" />
    </div>
    <div className="h-9 bg-gray-200 rounded-lg w-full mt-1" />
  </div>
);

const useQueryParams = () => {
  const location = useLocation();
  const history = useHistory();

  const getParam = (key, fallback = '') => {
    const params = new URLSearchParams(location.search);
    return params.get(key) ?? fallback;
  };

  const getParamArray = (key) => {
    const params = new URLSearchParams(location.search);
    const val = params.get(key);
    return val ? val.split(',').filter(Boolean) : [];
  };

  const setParam = (key, value) => {
    const next = new URLSearchParams(location.search);
    if (value === null || value === '' || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    history.replace({ search: next.toString() });
  };

  return { getParam, getParamArray, setParam, history };
};

const CategoriaProductos = () => {
  const { dep_id } = useParams();
  const { getParam, getParamArray, setParam, history } = useQueryParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');

  // Filters from URL
  const search = getParam('q', '');
  const debouncedSearch = useDebounce(search, 300);
  const sortBy = getParam('sort', 'relevancia');
  const selectedCategorias = getParamArray('categorias'); // multi-select array
  const minPrecio = getParam('minPrecio', '');
  const maxPrecio = getParam('maxPrecio', '');

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

  const subcategorias = useMemo(() => {
    const set = new Set(products.map(p => p.categoria).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const precioMin = useMemo(
    () => products.length ? Math.floor(Math.min(...products.map(p => Number(p.precio) || 0))) : 0,
    [products]
  );
  const precioMax = useMemo(
    () => products.length ? Math.ceil(Math.max(...products.map(p => Number(p.precio) || 0))) : 0,
    [products]
  );

  const toggleCategoria = (cat) => {
    const next = selectedCategorias.includes(cat)
      ? selectedCategorias.filter(c => c !== cat)
      : [...selectedCategorias, cat];
    setParam('categorias', next.length ? next.join(',') : null);
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = [p.clave, p.claveAlterna, p.descripcion, p.categoria, p.caracteristicas]
        .some(f => f?.toLowerCase().includes(debouncedSearch.toLowerCase()));
      if (!matchSearch) return false;

      if (selectedCategorias.length > 0 && !selectedCategorias.includes(p.categoria)) return false;

      const precio = Number(p.precio);
      if (minPrecio !== '' && precio < Number(minPrecio)) return false;
      if (maxPrecio !== '' && precio > Number(maxPrecio)) return false;

      return true;
    });
  }, [products, debouncedSearch, selectedCategorias, minPrecio, maxPrecio]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'precio-asc') return Number(a.precio) - Number(b.precio);
      if (sortBy === 'precio-desc') return Number(b.precio) - Number(a.precio);
      if (sortBy === 'existencia') return Number(b.existencia) - Number(a.existencia);
      return 0;
    });
  }, [filtered, sortBy]);

  const inStock = products.filter(p => Number(p.existencia) > 0).length;

  const activeFiltersCount = [
    selectedCategorias.length > 0,
    minPrecio !== '',
    maxPrecio !== '',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    if (search) next.set('q', search);
    if (sortBy !== 'relevancia') next.set('sort', sortBy);
    history.replace({ search: next.toString() });
  };

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-800 text-base">Filtros</h2>
        {activeFiltersCount > 0 && (
          <button onClick={clearAllFilters} className="text-xs text-red-500 hover:underline font-medium">
            Limpiar ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Rango de precio */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Rango de precio</p>
        {!loading && products.length > 0 && (
          <p className="text-xs text-gray-400 mb-2">
            ${precioMin.toLocaleString('es-MX')} – ${precioMax.toLocaleString('es-MX')}
          </p>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Mín</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrecio}
              onChange={e => setParam('minPrecio', e.target.value || null)}
              disabled={loading}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Máx</label>
            <input
              type="number"
              min="0"
              placeholder="∞"
              value={maxPrecio}
              onChange={e => setParam('maxPrecio', e.target.value || null)}
              disabled={loading}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Subcategoría multi-select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">Subcategoría</p>
          {selectedCategorias.length > 0 && (
            <button
              onClick={() => setParam('categorias', null)}
              className="text-xs text-blue-500 hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>
        {loading ? (
          <div className="space-y-1.5 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-lg w-full" />
            ))}
          </div>
        ) : subcategorias.length === 0 ? (
          <p className="text-xs text-gray-400">Sin subcategorías</p>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
            {subcategorias.map(cat => {
              const isSelected = selectedCategorias.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategoria(cat)}
                  className={`flex items-center gap-2 text-left px-3 py-3 rounded-lg text-xs transition font-medium leading-snug min-h-[44px] ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                    isSelected ? 'border-white bg-white/20' : 'border-gray-400'
                  }`}>
                    {isSelected && <span className="text-white text-xs leading-none">✓</span>}
                  </span>
                  <span className="flex-1">{cat}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 min-w-0">
              <Link to="/" className="hover:text-blue-600 shrink-0">Inicio</Link>
              <span>/</span>
              <Link to="/catalogo" className="hover:text-blue-600 shrink-0">Catálogo</Link>
              <span>/</span>
              <span className="text-gray-900 truncate">{categoryName || 'Categoría'}</span>
            </div>
            <Link
              to="/catalogo"
              className="flex items-center gap-1 bg-gray-600 text-white hover:bg-gray-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition shrink-0"
            >
              ← <span className="hidden sm:inline">Regresar al catálogo</span><span className="sm:hidden">Catálogo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gray-700 text-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 sm:gap-6">
          <img
            src={categoryImage || noImage}
            alt={categoryName || 'Categoría'}
            className="h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-md object-cover shadow-xl border-2 border-white/90 shrink-0"
            onError={e => { e.target.src = noImage; }}
          />
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{categoryName || 'Productos'}</h1>
            {!loading && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                <p className="text-gray-300 text-sm">{products.length.toLocaleString()} productos</p>
                <span className="text-green-400 text-xs sm:text-sm font-medium">{inStock.toLocaleString()} en stock</span>
                {products.length - inStock > 0 && (
                  <span className="text-red-400 text-xs sm:text-sm">{(products.length - inStock).toLocaleString()} sin existencia</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className="flex items-center gap-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 shadow-sm"
          >
            <span>⚙️ Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{activeFiltersCount}</span>
            )}
            <span className="ml-auto text-gray-400">{filtersOpen ? '▲' : '▼'}</span>
          </button>
          {filtersOpen && (
            <div className="mt-2 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <FilterPanel />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4 lg:gap-6">

          {/* ── Sidebar Filters (tablet+) ── */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">

              {/* Toolbar: search + sort */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por clave, descripción..."
                    value={search}
                    onChange={e => setParam('q', e.target.value || null)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <select
                    value={sortBy}
                    onChange={e => setParam('sort', e.target.value === 'relevancia' ? null : e.target.value)}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="precio-asc">Precio ↑</option>
                    <option value="precio-desc">Precio ↓</option>
                    <option value="existencia">Existencia</option>
                  </select>
                  {!loading && (
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {sorted.length}<span className="hidden sm:inline"> de {products.length}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Active filter chips */}
              {!loading && (selectedCategorias.length > 0 || minPrecio || maxPrecio) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategorias.map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {cat}
                      <button onClick={() => toggleCategoria(cat)} className="ml-0.5 hover:text-blue-900 font-bold">✕</button>
                    </span>
                  ))}
                  {(minPrecio || maxPrecio) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      ${minPrecio || '0'} – ${maxPrecio || '∞'}
                      <button
                        onClick={() => { setParam('minPrecio', null); setParam('maxPrecio', null); }}
                        className="ml-0.5 hover:text-purple-900 font-bold"
                      >✕</button>
                    </span>
                  )}
                </div>
              )}

              {/* Product cards — optimized for mobile */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : sorted.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-gray-400 text-base">No se encontraron productos</p>
                  {(search || activeFiltersCount > 0) && (
                    <button onClick={clearAllFilters} className="mt-3 text-blue-600 text-sm hover:underline">
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {sorted.map((product, index) => {
                    const enStock = Number(product.existencia) > 0;
                    const catSelected = selectedCategorias.includes(product.categoria);
                    return (
                      <div
                        key={product.clave + index}
                        className={`bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col p-3 transition hover:shadow-md ${!enStock ? 'opacity-60' : ''}`}
                      >
                        {/* Clave */}
                        <span className="font-mono text-gray-400 text-[10px] leading-tight truncate">
                          {product.clave}
                          {product.claveAlterna && product.claveAlterna !== product.clave && ` / ${product.claveAlterna}`}
                        </span>

                        {/* Descripción */}
                        <p className="text-gray-900 font-semibold text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.5rem] mt-1">
                          {product.descripcion}
                        </p>

                        {/* Categoría badge */}
                        {product.categoria && (
                          <button
                            onClick={() => toggleCategoria(product.categoria)}
                            className={`self-start mt-1.5 px-2 py-0.5 rounded-full text-[14px] font-medium transition ${
                              catSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-700'
                            }`}
                          >
                            {product.categoria}
                          </button>
                        )}

                        {/* Price + stock — spacer pushes this to bottom */}
                        <div className="mt-auto pt-2 flex items-end justify-between gap-1">
                          <span className="font-bold text-blue-600 text-sm sm:text-lg leading-none">
                            ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                          </span>
                          {enStock ? (
                            <span className="text-[14px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              {Number(product.existencia).toLocaleString()} piezas
                            </span>
                          ) : (
                            <span className="text-[14px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              Sin stock
                            </span>
                          )}
                        </div>

                        {/* CTA */}
                        <Link
                          to={`/producto/${product.clave}`}
                          className="mt-2 block w-full text-center bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition text-xs font-semibold min-h-[36px] flex items-center justify-center"
                        >
                          Ver detalle →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriaProductos;
