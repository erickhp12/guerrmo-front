import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiX, FiRefreshCw, FiCopy, FiCheck, FiMapPin } from 'react-icons/fi';
import logo from '../../assets/img/miniLogo.png';
import config from '../../config.js';
import { getProfile, apiFetch } from '../../utils.js';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const STATUS_LABELS = {
  nuevo: 'Nuevo',
  en_proceso: 'En Proceso',
  entregado: 'Entregado',
};

const STATUS_STYLES = {
  nuevo: 'bg-blue-100 text-blue-800',
  en_proceso: 'bg-yellow-100 text-yellow-800',
  entregado: 'bg-green-100 text-green-800',
};

const AdminPanel = () => {
  const history = useHistory();
  const { search } = useLocation();
  const profile = getProfile();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);
  const [clientAddress, setClientAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  // Reports state
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('7d');
  const [reportClientId, setReportClientId] = useState('0');

  // Auth guard — solo admins
  useEffect(() => {
    if (profile.is_guest || !profile.is_admin) {
      history.replace('/login');
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`${config.API_URL}/articles/orders-clients/0`);
      const data = await res.json();
      if (data.error) {
        setError(data.message || 'Error al cargar pedidos');
      } else {
        setOrders(data.data || []);
      }
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile.is_guest) fetchOrders();
  }, []);

  // Abre automáticamente la orden indicada en el query param ?orden=ID
  useEffect(() => {
    if (!orders.length || detailOrder) return;
    const ordenId = new URLSearchParams(search).get('orden');
    if (!ordenId) return;
    const found = orders.find((o) => String(o.id) === ordenId);
    if (found) openDetail(found);
  }, [orders, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      const res = await apiFetch(`${config.API_URL}/articles/order/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.error) {
        // Revert on error
        fetchOrders();
      }
    } catch {
      fetchOrders();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'todos' || order.status === selectedStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      (order.client_name || '').toLowerCase().includes(term) ||
      (order.client_phone || '').includes(term) ||
      String(order.id).includes(term);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    nuevo: orders.filter(o => o.status === 'nuevo').length,
    en_proceso: orders.filter(o => o.status === 'en_proceso').length,
    entregado: orders.filter(o => o.status === 'entregado').length,
    totalMonto: orders.reduce((acc, o) => acc + (o.total_price || 0), 0),
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const openDetail = async (order) => {
    setDetailOrder(order);
    setClientAddress(null);
    if (order.client_id >= 900000) return;
    setLoadingAddress(true);
    try {
      const res = await apiFetch(`${config.API_URL}/clients/prefill/${order.client_id}/`);
      const data = await res.json();
      if (!data.error) setClientAddress(data.data);
    } catch (_) {
      // address not critical
    } finally {
      setLoadingAddress(false);
    }
  };

  const closeDetail = () => {
    setDetailOrder(null);
    setClientAddress(null);
    setCopied(false);
  };

  const buildAddressString = (addr) => {
    if (!addr) return '';
    return [addr.calle, addr.noExt, addr.noInt, addr.colonia, addr.localidad, addr.codigoPostal, 'México']
      .filter(Boolean)
      .join(', ');
  };

  const getMapsLink = (addr) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildAddressString(addr))}`;

  const getMapsEmbed = (addr) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(buildAddressString(addr))}&output=embed&hl=es`;

  const copyMapsLink = async (addr) => {
    try {
      await navigator.clipboard.writeText(getMapsLink(addr));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const handleStatusChangeInModal = (orderId, newStatus) => {
    setDetailOrder(prev => ({ ...prev, status: newStatus }));
    handleStatusChange(orderId, newStatus);
  };

  const fetchReports = async (period = reportPeriod, clientId = reportClientId) => {
    setReportLoading(true);
    try {
      const params = new URLSearchParams({ period, client_id: clientId });
      const res = await apiFetch(`${config.API_URL}/articles/reports/?${params}`);
      const data = await res.json();
      setReportData(data);
    } catch (_) {
      setReportData(null);
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [reportPeriod, reportClientId]);

  if (profile.is_guest || !profile.is_admin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Guerrmo" className="h-10 w-auto" />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Inicio</Link>
              <Link to="/catalogo" className="text-gray-700 hover:text-blue-600 font-medium">Catálogo</Link>
              <Link to="/pedido" className="text-gray-700 hover:text-blue-600 font-medium">Mi Pedido</Link>
              <Link to="/admin" className="text-blue-600 font-medium">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Panel Administrativo</h1>
            <p className="text-red-100">Gestiona los pedidos de tus clientes</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition font-medium text-sm"
          >
            <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 col-span-2 md:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Total pedidos</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Nuevos</p>
            <p className="text-3xl font-bold text-blue-600">{stats.nuevo}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">En Proceso</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.en_proceso}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Entregados</p>
            <p className="text-3xl font-bold text-green-600">{stats.entregado}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Monto total</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalMonto.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Nombre, teléfono o ID de pedido..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los pedidos</option>
                <option value="nuevo">Nuevos</option>
                <option value="en_proceso">En Proceso</option>
                <option value="entregado">Entregados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Pedido</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contacto</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No se encontraron pedidos
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">#{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{order.client_name}</div>
                          <div className="text-xs text-gray-500">{order.total_items} artículo(s)</div>
                        </td>
                        <td className="px-6 py-4">
                          {order.client_phone ? (
                            <a href={`tel:${order.client_phone.replace(/\D/g, '')}`} className="text-sm text-gray-900 hover:text-blue-600 transition-colors">
                              {order.client_phone}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            disabled={updatingStatus === order.id}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="en_proceso">En Proceso</option>
                            <option value="entregado">Entregado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${(order.total_price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openDetail(order)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ───── Reportes ───── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
          <button
            onClick={() => fetchReports()}
            disabled={reportLoading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            <FiRefreshCw size={14} className={reportLoading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* TODO(human): render the period filter tabs here.
              The options are: { label, value } for '7d', '30d', 'month', 'all'.
              Each tab should be a <button> that calls setReportPeriod(value).
              Style the active tab differently from inactive ones. */}

          {/* Client filter */}
          <select
            value={reportClientId}
            onChange={e => setReportClientId(e.target.value)}
            className="ml-auto text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="0">Todos los clientes</option>
            {[...new Map(orders.map(o => [o.client_id, o.client_name])).entries()].map(([id, name]) => (
              <option key={id} value={id}>{name} (#{id})</option>
            ))}
          </select>
        </div>

        {reportLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!reportLoading && reportData && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-500 mb-1">Órdenes</p>
                <p className="text-3xl font-bold text-gray-900">{reportData.summary.total_orders}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-500 mb-1">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  ${reportData.summary.total_revenue.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-500 mb-1">Ticket promedio</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${reportData.summary.avg_ticket.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-500 mb-1">Artículos vendidos</p>
                <p className="text-3xl font-bold text-purple-600">{reportData.summary.total_articles_sold}</p>
              </div>
            </div>

            {/* Revenue over time */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Ingresos por día</h3>
              {reportData.orders_by_date.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Sin datos para el período seleccionado</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={reportData.orders_by_date} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v) => [`$${Number(v).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 'Ingresos']}
                      labelFormatter={l => `Fecha: ${l}`}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fill="url(#revenueGrad)" />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={1.5} fill="none" name="Órdenes" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bottom row: top products + top clients */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Top products */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 10 piezas más vendidas</h3>
                {reportData.top_products.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      layout="vertical"
                      data={reportData.top_products}
                      margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis
                        type="category"
                        dataKey="art_id"
                        tick={{ fontSize: 10 }}
                        width={75}
                      />
                      <Tooltip
                        formatter={(v, name) => [v, name === 'qty' ? 'Unidades' : 'Ingresos']}
                        labelFormatter={label => {
                          const p = reportData.top_products.find(x => x.art_id === label);
                          return p ? p.description : label;
                        }}
                      />
                      <Bar dataKey="qty" fill="#6366f1" radius={[0, 4, 4, 0]} name="Unidades" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Top clients */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 10 clientes por ingresos</h3>
                {reportData.top_clients.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      layout="vertical"
                      data={reportData.top_clients}
                      margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                      <YAxis
                        type="category"
                        dataKey="client_name"
                        tick={{ fontSize: 10 }}
                        width={90}
                        tickFormatter={n => n.length > 12 ? n.slice(0, 12) + '…' : n}
                      />
                      <Tooltip
                        formatter={(v) => [`$${Number(v).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 'Ingresos']}
                        labelFormatter={label => {
                          const c = reportData.top_clients.find(x => x.client_name === label);
                          return c ? `${c.client_name} — ${c.orders} orden(es)` : label;
                        }}
                      />
                      <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} name="Ingresos" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

            </div>
          </>
        )}

      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={closeDetail}>
          <div className="absolute inset-0 bg-black/50" />

          <div
            className="relative bg-white rounded-2xl shadow-2xl w-[70%] max-h-[88vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-8 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pedido #{detailOrder.id}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{formatDate(detailOrder.created_at)}</p>
              </div>
              <button onClick={closeDetail} className="p-2 rounded-xl hover:bg-gray-100 transition">
                <FiX size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

              {/* Status + update */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Estado:</span>
                <select
                  value={detailOrder.status}
                  disabled={updatingStatus === detailOrder.id}
                  onChange={e => handleStatusChangeInModal(detailOrder.id, e.target.value)}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none ${STATUS_STYLES[detailOrder.status] || 'bg-gray-100 text-gray-700'}`}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="entregado">Entregado</option>
                </select>
                {updatingStatus === detailOrder.id && (
                  <span className="text-xs text-gray-400">Guardando…</span>
                )}
              </div>

              {/* Two-column layout: client info + map */}
              <div className="grid grid-cols-2 gap-6">

                {/* Client info */}
                <section>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Datos del cliente</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm h-full">
                    <p><span className="font-medium text-gray-700">Nombre:</span> {detailOrder.client_name}</p>
                    <p><span className="font-medium text-gray-700">ID:</span> {detailOrder.client_id}</p>
                    {detailOrder.client_phone && (
                      <p>
                        <span className="font-medium text-gray-700">Teléfono:</span>{' '}
                        <a href={`tel:${detailOrder.client_phone.replace(/\D/g,'')}`} className="text-blue-600 hover:underline">
                          {detailOrder.client_phone}
                        </a>
                      </p>
                    )}
                    {loadingAddress && <p className="text-gray-400 italic">Cargando dirección…</p>}
                    {clientAddress && (
                      <>
                        {clientAddress.correo && (
                          <p><span className="font-medium text-gray-700">Correo:</span> {clientAddress.correo}</p>
                        )}
                        {(clientAddress.calle || clientAddress.noExt) && (
                          <p>
                            <span className="font-medium text-gray-700">Calle:</span>{' '}
                            {[clientAddress.calle, clientAddress.noExt, clientAddress.noInt].filter(Boolean).join(' ')}
                          </p>
                        )}
                        {clientAddress.colonia && (
                          <p><span className="font-medium text-gray-700">Colonia:</span> {clientAddress.colonia}</p>
                        )}
                        {clientAddress.localidad && (
                          <p>
                            <span className="font-medium text-gray-700">Ciudad:</span>{' '}
                            {clientAddress.localidad}
                            {clientAddress.codigoPostal ? `, C.P. ${clientAddress.codigoPostal}` : ''}
                          </p>
                        )}
                      </>
                    )}
                    {detailOrder.client_id >= 900000 && (
                      <p className="text-gray-400 italic">Cliente invitado — sin dirección registrada</p>
                    )}
                  </div>
                </section>

                {/* Map */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FiMapPin size={12} /> Ubicación
                    </h3>
                    {clientAddress && buildAddressString(clientAddress) && (
                      <button
                        onClick={() => copyMapsLink(clientAddress)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                          copied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                        {copied ? 'Link copiado' : 'Copiar link para repartidor'}
                      </button>
                    )}
                  </div>
                  {clientAddress && buildAddressString(clientAddress) ? (
                    <iframe
                      title="maps"
                      src={getMapsEmbed(clientAddress)}
                      width="100%"
                      height="220"
                      className="rounded-xl border border-gray-100"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl border border-gray-100 h-[220px] flex items-center justify-center text-sm text-gray-400">
                      {loadingAddress ? 'Cargando…' : 'Sin dirección disponible'}
                    </div>
                  )}
                </section>
              </div>

              {/* Articles */}
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Artículos ({(detailOrder.articles || []).length})
                </h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Clave</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Descripción</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Precio</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Cant.</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(detailOrder.articles || []).map((art, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-900">{art.art_id}</td>
                          <td className="px-4 py-3 text-gray-600">{art.description || '—'}</td>
                          <td className="px-4 py-3 text-right text-gray-700">${Number(art.price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{art.qty}</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            ${(art.price * art.qty).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Total */}
              <div className="flex justify-end border-t border-gray-100 pt-4 pb-2">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{detailOrder.total_items} artículo(s)</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    Total: ${(detailOrder.total_price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
