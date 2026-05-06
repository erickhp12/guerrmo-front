import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { trackPageView } from './analytics';

const Home = lazy(() => import('./views/Mockup/Home'));
const Catalogo = lazy(() => import('./views/Mockup/Catalogo'));
const ProductoDetalle = lazy(() => import('./views/Mockup/ProductoDetalle'));
const Pedido = lazy(() => import('./views/Mockup/Pedido'));
const AdminPanel = lazy(() => import('./views/Mockup/AdminPanel'));
const CategoriaProductos = lazy(() => import('./views/Mockup/CategoriaProductos'));
const BuscarResultados = lazy(() => import('./views/Mockup/BuscarResultados'));
const Login = lazy(() => import('./views/Mockup/Login'));
const NotFound = lazy(() => import('./views/Mockup/NotFound'));
const Sucursales = lazy(() => import('./views/Mockup/Sucursales'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <p className="text-gray-400 text-sm">Cargando...</p>
  </div>
);

const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
};

const MockupRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouteTracker />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/catalogo" component={Catalogo} />
        <Route exact path="/buscar" component={BuscarResultados} />
        <Route exact path="/sucursales" component={Sucursales} />
        <Route exact path="/categoria/:dep_id" component={CategoriaProductos} />
        <Route exact path="/producto/:id" component={ProductoDetalle} />
        <Route exact path="/pedido" component={Pedido} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/admin" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default MockupRoutes;
