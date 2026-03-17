import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './views/Mockup/Home';
import Catalogo from './views/Mockup/Catalogo';
import ProductoDetalle from './views/Mockup/ProductoDetalle';
import Pedido from './views/Mockup/Pedido';
import AdminPanel from './views/Mockup/AdminPanel';
import CategoriaProductos from './views/Mockup/CategoriaProductos';
import BuscarResultados from './views/Mockup/BuscarResultados';

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
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default MockupRoutes;
