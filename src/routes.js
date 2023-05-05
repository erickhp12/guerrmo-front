// import
import Tables from "views/Dashboard/Tables";
import TablesCart from "views/Dashboard/TablesCart";
import Profile from "views/Dashboard/Profile";
import SignIn from "views/Auth/SignIn.js";
import {
  PersonIcon,
  RocketIcon,
  CartIcon,
} from "components/Icons/Icons";
import { RiLoginBoxLine } from "react-icons/ri";

var dashRoutes = [
  {
    path: "/tables",
    name: "Productos",
    icon: <RocketIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/carrito",
    name: "Carrito",
    icon: <CartIcon color="inherit" />,
    component: TablesCart,
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
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: 'Iniciar sesion',
        icon: <RiLoginBoxLine color="inherit" />,
        component: SignIn,
        layout: "/auth",
      }
    ],
  },
];
export default dashRoutes;
