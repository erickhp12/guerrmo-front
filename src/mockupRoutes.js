import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './views/Mockup/Home';
import Catalogo from './views/Mockup/Catalogo';
import ProductoDetalle from './views/Mockup/ProductoDetalle';
import Pedido from './views/Mockup/Pedido';
import AdminPanel from './views/Mockup/AdminPanel';
import CategoriaProductos from './views/Mockup/CategoriaProductos';
import BuscarResultados from './views/Mockup/BuscarResultados';
import NotFound from './views/Mockup/NotFound';

const MockupRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/catalogo" component={Catalogo} />
      <Route exact path="/buscar" component={BuscarResultados} />
      <Route exact path="/categoria/:dep_id" component={CategoriaProductos} />
      <Route exact path="/producto/:id" component={ProductoDetalle} />
      <Route exact path="/pedido" component={Pedido} />
      <Route exact path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default MockupRoutes;
