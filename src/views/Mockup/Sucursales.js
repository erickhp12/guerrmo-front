import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiClock, FiExternalLink } from 'react-icons/fi';
import Navbar from '../../components/Navbar';

const noImage = 'https://guerrmo-store.s3.us-east-1.amazonaws.com/general/default-image.png';

const SUCURSALES = [
  {
    name: 'Carlos Amaya',
    img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/amaya.jpeg',
    address: 'C. Perimetral Carlos Amaya #1805, Col. Aztecas',
    tel1: '(656) 537-97-77',
    tel2: '(656) 472-86-36',
    email: 'carlosamaya@guerrmo.com',
    hours: 'Lun–Vie 9am–6pm · Sáb 9am–4pm',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3394.6495084278413!2d-106.46777692383309!3d31.698148238336348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e75eeb596e974d%3A0x941acb6a75bb3b72!2sC.%20Perimetral%20Carlos%20Amaya%201805%2C%20Aztecas%2C%2032280%20Ju%C3%A1rez%2C%20Chih.!5e0!3m2!1sen!2smx!4v1775410702998!5m2!1sen!2smx',
    mapLink: 'https://maps.google.com/?q=31.698148,-106.467777',
  },
  {
    name: 'Henequén',
    img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/henequen.jpeg',
    address: 'Ejido Buenaventura #1303, Col. Terrenos Nacionales',
    tel1: '(656) 790-09-61',
    tel2: '(656) 791-00-92',
    email: 'henequen@guerrmo.com',
    hours: 'Lun–Vie 9am–6pm · Sáb 9am–4pm',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d415.88557741452337!2d-106.3650039706411!3d31.63402939870298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e7677aea6c27e3%3A0x66dff1f82a52e4c5!2sBaleros%20y%20Suspensi%C3%B3n%20Guerrmo!5e0!3m2!1sen!2smx!4v1775410754592!5m2!1sen!2smx',
    mapLink: 'https://maps.google.com/?q=31.634029,-106.365004',
  },
  {
    name: 'Mezquital',
    img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/mezquital.jpeg',
    address: 'Mezquite Azul #1991',
    tel1: '(656) 737-34-76',
    tel2: '(614) 105-6379',
    email: 'mezquital@guerrmo.com',
    hours: 'Lun–Vie 9am–6pm · Sáb 9am–4pm',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.6266409981304!2d-106.39621512383624!3d31.58928484373311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e766f7dfb1550b%3A0x18a3f049f55ca512!2sMezquite%20Azul%201991%2C%2032576%20Ju%C3%A1rez%2C%20Chih.!5e0!3m2!1sen!2smx!4v1775410774719!5m2!1sen!2smx',
    mapLink: 'https://maps.google.com/?q=31.589285,-106.396215',
  },
  {
    name: 'Oscar Flores',
    img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/oscar-flores.jpeg',
    address: 'Blvd. Oscar Flores #6294',
    tel1: '(656) 899-47-10',
    tel2: '(614) 197-86-52',
    email: 'oscarflores@guerrmo.com',
    hours: 'Lun–Vie 9am–6pm · Sáb 9am–4pm',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.9105780004984!2d-106.44384552383414!3d31.66366614004745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e75e7567cee389%3A0x32770c23aadf21cc!2sBlvd.%20%C3%93scar%20Flores%206294%2C%20LOMAS%20DE%20SAN%20JOSE%2C%2032680%20Ju%C3%A1rez%2C%20Chih.!5e0!3m2!1sen!2smx!4v1775410799338!5m2!1sen!2smx',
    mapLink: 'https://maps.google.com/?q=31.663666,-106.443846',
  },
  {
    name: 'San Lorenzo',
    img: 'https://guerrmo-store.s3.us-east-1.amazonaws.com/sucursales/san-lorenzo.jpeg',
    address: 'Av. Paseo Triunfo de la República #6444, San Lorenzo',
    tel1: '(656) 903-29-80',
    tel2: '(656) 345-59-97',
    email: 'sanlorenzo@guerrmo.com',
    hours: 'Lun–Vie 9am–6pm · Sáb 9am–4pm',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.142137126481!2d-106.4282489483177!3d31.73932105984516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e75bf07852b65d%3A0x79e4ecf468079e8d!2sAv.%20Paseo%20Triunfo%20de%20la%20Rep%C3%BAblica%206444%2C%20San%20Lorenzo%2C%2032320%20Ju%C3%A1rez%2C%20Chih.!5e0!3m2!1sen!2smx!4v1775410857129!5m2!1sen!2smx',
    mapLink: 'https://maps.google.com/?q=31.739321,-106.428249',
  },
];

const Sucursales = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const queryIndex = parseInt(params.get('s'), 10);
  const initialIndex = !isNaN(queryIndex) && queryIndex >= 0 && queryIndex < SUCURSALES.length
    ? queryIndex
    : 1;

  const [selected, setSelected] = useState(initialIndex);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const s = SUCURSALES[selected];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 to-slate-400 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Nuestras sucursales</h1>
          <p className="text-gray-200">Visítanos en cualquiera de nuestros 5 puntos en Ciudad Juárez</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-8">
          {SUCURSALES.map((suc, i) => (
            <button
              key={suc.name}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                selected === i
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {suc.name}
            </button>
          ))}
        </div>

        {/* Sucursal detail */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Imagen */}
            <div className="relative h-64 lg:h-auto" style={{ minHeight: '320px' }}>
              <img
                key={selected}
                src={s.img || noImage}
                alt={`Sucursal ${s.name}`}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = noImage; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <h2 className="absolute bottom-4 left-5 text-white text-2xl font-bold">{s.name}</h2>
            </div>

            {/* Mapa */}
            <div style={{ minHeight: '320px' }}>
              <iframe
                key={selected}
                src={s.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '320px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa ${s.name}`}
              />
            </div>
          </div>

          {/* Info footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <FiMapPin className="mt-0.5 shrink-0 text-blue-500" size={15} />
                  <span>{s.address}</span>
                </li>
                <li className="flex items-center gap-2.5 flex-wrap">
                  <FiPhone className="shrink-0 text-blue-500" size={15} />
                  <a href={`tel:${s.tel1.replace(/\D/g, '')}`} className="hover:text-blue-600 transition-colors">{s.tel1}</a>
                  <span className="text-gray-300">·</span>
                  <a href={`tel:${s.tel2.replace(/\D/g, '')}`} className="hover:text-blue-600 transition-colors">{s.tel2}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <FiMail className="shrink-0 text-blue-500" size={15} />
                  <a href={`mailto:${s.email}`} className="hover:text-blue-600 transition-colors">{s.email}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <FiClock className="shrink-0 text-blue-500" size={15} />
                  <span>{s.hours}</span>
                </li>
              </ul>
              <a
                href={s.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-95 transition-all self-start sm:self-center whitespace-nowrap"
              >
                <FiExternalLink size={15} />
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sucursales;
