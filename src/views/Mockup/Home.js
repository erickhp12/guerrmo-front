import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiClock, FiTruck, FiPackage, FiZap, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import logo from '../../assets/img/miniLogo.png';
const noImage = 'https://guerrmo-store.s3.us-east-1.amazonaws.com/general/no-image.svg';
import config from '../../config.js';
import SearchBar from '../../components/SearchBar';
import Navbar from '../../components/Navbar';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollToSucursales = (e) => {
    e.preventDefault();
    document.getElementById('sucursales')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch(`${config.API_URL}/articles/categories/`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const formattedCategories = data.data.slice(0, 10).map(cat => ({
            id: cat.id,
            name: cat.departamento,
            icon: cat.imagen || null,
            count: cat.total
          }));
          setCategories(formattedCategories);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-300 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">
                ¿Qué pieza estás buscando?
              </h1>
              <p className="text-xl mb-1 font-bold">
                Solicita tus productos en línea y recíbelos en tu domicilio.
              </p>
              <p className="text-md mb-8 text-white">
                Refacciones de calidad en Ciudad Juárez.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalogo" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-center">
                  Ver catálogo completo
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-700 font-semibold mb-3 text-sm">Busca tu refacción</p>
                  <SearchBar placeholder="Balatas, filtros, baterías, bujías..." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Categorías</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/catalogo?category=${cat.name}`}
                  className="bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-600 rounded-xl p-6 text-center card-hover group"
                >
                  <div className="mb-3 flex justify-center">
                    <img
                      className="max-h-16 max-w-[5rem] object-contain"
                      src={cat.icon || noImage}
                      alt={cat.name}
                      onError={e => { e.target.src = noImage; }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.count} productos</p>
                </Link>
              ))}
            </div>
          )}
          <Link to={`/catalogo`} className='flex justify-end mt-5 text-xl font-medium underline text-blue-500'>Ver todas las categorias <FiArrowRight size={28} /></Link>
        </div>
      </section>

      {/* Sucursales */}
      <section id="sucursales" className="py-16 bg-gray-50 sucursales">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Nuestras sucursales</h2>
            <p className="text-gray-500">Visítanos en cualquiera de nuestros 5 sucursales en Ciudad Juárez</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Carlos Amaya',
                img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/amaya.jpeg',
                address: 'C. Perimetral Carlos Amaya #1805, Col. Aztecas',
                tel1: '(656) 537-97-77',
                tel2: '(656) 472-86-36',
                email: 'carlosamaya@guerrmo.com',
              },
              {
                name: 'Henequén',
                img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/henequen.jpeg',
                address: 'Ejido Buenaventura #1303, Col. Terrenos Nacionales',
                tel1: '(656) 790-09-61',
                tel2: '(656) 791-00-92',
                email: 'henequen@guerrmo.com',
              },
              {
                name: 'Mezquital',
                img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/mezquital.jpeg',
                address: 'Mezquite Azul #1991',
                tel1: '(656) 737-34-76',
                tel2: '(614) 105-6379',
                email: 'mezquital@guerrmo.com',
              },
              {
                name: 'Oscar Flores',
                img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/oscar-flores.jpeg',
                address: 'Blvd. Oscar Flores #6294',
                tel1: '(656) 899-47-10',
                tel2: '(614) 197-86-52',
                email: 'oscarflores@guerrmo.com',
              },
              {
                name: 'San Lorenzo',
                img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/san-lorenzo.jpeg',
                address: 'Av. Paseo Triunfo de la República #6444, San Lorenzo',
                tel1: '(656) 903-29-80',
                tel2: '(656) 345-59-97',
                email: 'sanlorenzo@guerrmo.com',
              },
            ].map(s => (
              <div key={s.name} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover flex flex-col">
                <img
                  src={s.img || noImage}
                  alt={`Sucursal ${s.name}`}
                  className="w-full h-44 object-cover"
                  onError={e => { e.target.src = noImage; }}
                />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{s.name}</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <FiMapPin className="mt-0.5 shrink-0 text-gray-400" size={14} />
                      <span>{s.address}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiPhone className="shrink-0 text-gray-400" size={14} />
                      <a href={`tel:${s.tel1.replace(/\D/g,'')}`} className="hover:text-blue-600 transition-colors">{s.tel1}</a>
                      <span className="text-gray-300">·</span>
                      <a href={`tel:${s.tel2.replace(/\D/g,'')}`} className="hover:text-blue-600 transition-colors">{s.tel2}</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiMail className="shrink-0 text-gray-400" size={14} />
                      <a href={`mailto:${s.email}`} className="hover:text-blue-600 transition-colors truncate">{s.email}</a>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiClock className="shrink-0 text-gray-400" size={14} />
                      <span>Lun–Vie 9am–6pm · Sáb 9am–4pm</span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">¿Por qué elegir Guerrmo?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Atención Local</h3>
              <p className="text-gray-600">Servicio personalizado en Ciudad Juárez con más de 10 años de experiencia</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega a Domicilio</h3>
              <p className="text-gray-600">Llevamos tus refacciones donde las necesites</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Amplio Catálogo</h3>
              <p className="text-gray-600">Miles de refacciones para todas las marcas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Respuesta Rápida</h3>
              <p className="text-gray-600">Confirmamos tu pedido en menos de 2 horas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="font-bold text-xl mb-3">Busca tu refacción</h3>
                <p className="text-gray-600">Explora nuestro catálogo o usa el buscador para encontrar lo que necesitas</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="font-bold text-xl mb-3">Haz tu pedido</h3>
                <p className="text-gray-600">Agrega productos y completa el formulario con tus datos de contacto</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="font-bold text-xl mb-3">Recibe en tu domicilio</h3>
                <p className="text-gray-600">Te contactamos para confirmar disponibilidad y coordinar la entrega</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Marca */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="Guerrmo" className="h-10 w-auto" />
                <span className="text-xl font-bold tracking-tight">Guerrmo</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tu refaccionaria de confianza en Ciudad Juárez. Refacciones automotrices de calidad con entrega a domicilio.
              </p>
            </div>
            {/* Navegación */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">Navegación</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
                <li><Link onClick={scrollToSucursales} className="hover:text-white transition-colors">Sucursales</Link></li>
              </ul>
            </div>
            {/* Categorías */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">Categorías</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat.id}>
                    <Link to={`/catalogo?category=${cat.name}`} className="hover:text-white transition-colors">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contacto */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">Contacto</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <FiPhone className="mt-0.5 shrink-0 text-gray-400" size={14} />
                  <div>
                    <p className="text-white font-medium">Teléfono</p>
                    <a href="tel:6567900961" className="hover:text-white transition-colors">(656) 790-09-61</a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <FiMail className="mt-0.5 shrink-0 text-gray-400" size={14} />
                  <div>
                    <p className="text-white font-medium">Correo</p>
                    <a href="mailto:henequen@guerrmo.com" className="hover:text-white transition-colors">henequen@guerrmo.com</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-2 text-gray-500 text-sm">
            <p>&copy; 2026 Guerrmo. Refacciones automotrices en Ciudad Juárez. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
