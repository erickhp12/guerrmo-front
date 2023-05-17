// import
import Tables from "views/Dashboard/Tables";
import TablesCart from "views/Dashboard/TablesCart";
import TablesOrders from "views/Dashboard/TablesOrders";
import TablesOrdersClients from "views/Dashboard/TablesOrdersClients";
import Profile from "views/Dashboard/Profile";
import SignIn from "views/Auth/SignIn.js";
import {
  PersonIcon,
  RocketIcon,
  CartIcon,
  DocumentIcon,
} from "components/Icons/Icons";
import { RiLoginBoxLine } from "react-icons/ri";

var dashRoutes = [
  {
    path: "/tables",
    name: "Productos",
    requireLogin: false,
    isSuperAdmin: false,
    isLogin: false,
    icon: <RocketIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/carrito",
    name: "Carrito",
    requireLogin: true,
    isSuperAdmin: false,
    isLogin: false,
    icon: <CartIcon color="inherit" />,
    component: TablesCart,
    layout: "/admin",
  },
  {
    path: "/ordenes",
    name: "Ordenes",
    requireLogin: true,
    isSuperAdmin: false,
    isLogin: false,
    icon: <DocumentIcon color="inherit" />,
    component: TablesOrders,
    layout: "/admin",
  },
  {
    path: "/ordenes-clientes",
    name: "Ordenes de clientes",
    requireLogin: true,
    isSuperAdmin: true,
    icon: <DocumentIcon color="inherit" />,
    component: TablesOrdersClients,
    layout: "/admin",
  },
  {
    name: "SITIO",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Perfil",
        requireLogin: true,
        isSuperAdmin: false,
        isLogin: false,
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        requireLogin: false,
        isSuperAdmin: false,
        isLogin: true,
        name: 'Iniciar sesion',
        icon: <RiLoginBoxLine color="inherit" />,
        component: SignIn,
        layout: "/auth",
      }
    ],
  },
];
export default dashRoutes;
