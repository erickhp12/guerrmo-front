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
<<<<<<< HEAD
  DocumentIcon,
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
} from "components/Icons/Icons";
import { RiLoginBoxLine } from "react-icons/ri";

var dashRoutes = [
  {
    path: "/tables",
    name: "Productos",
<<<<<<< HEAD
    requireLogin: false,
    isSuperAdmin: false,
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
    icon: <RocketIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/carrito",
    name: "Carrito",
<<<<<<< HEAD
    requireLogin: true,
    isSuperAdmin: false,
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
    icon: <CartIcon color="inherit" />,
    component: TablesCart,
    layout: "/admin",
  },
  {
<<<<<<< HEAD
    path: "/ordenes",
    name: "Ordenes",
    requireLogin: true,
    isSuperAdmin: false,
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
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
    name: "SITIO",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Perfil",
<<<<<<< HEAD
        requireLogin: true,
        isSuperAdmin: false,
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
<<<<<<< HEAD
        requireLogin: false,
        isSuperAdmin: false,
=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
        name: 'Iniciar sesion',
        icon: <RiLoginBoxLine color="inherit" />,
        component: SignIn,
        layout: "/auth",
      }
    ],
  },
];
<<<<<<< HEAD

=======
>>>>>>> d46fe13b0d8bfc13edf6a37bb5186e01bb89c5af
export default dashRoutes;
