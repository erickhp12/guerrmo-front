import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

export const SUCURSALES = [
  { id: 'oscar-flores', name: 'Óscar Flores', phone: '526561978652' },
  { id: 'mezquital', name: 'Mezquital', phone: '526141056379' },
  { id: 'san-lorenzo', name: 'San Lorenzo', phone: '526563455997' },
  { id: 'henequen', name: 'Henequén', phone: '526564220018' },
  { id: 'amaya', name: 'Amaya', phone: '526567611604' },
];

const GENERIC_MESSAGE = '¡Hola! Me interesa información sobre sus refacciones. ¿Me pueden ayudar?';

export const buildWhatsAppLink = (phone, message) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export const SucursalDialog = ({
  open,
  onClose,
  onSelect,
  title = '¿Con qué sucursal deseas contactarte?',
  subtitle = 'Selecciona una sucursal para continuar tu chat por WhatsApp.',
}) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.55)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          maxWidth: 440,
          width: '100%',
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 24,
              lineHeight: 1,
              cursor: 'pointer',
              color: '#6b7280',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 0, marginBottom: 16 }}>{subtitle}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SUCURSALES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
                e.currentTarget.style.borderColor = '#25D366';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                <FaWhatsapp size={18} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                  Sucursal {s.name}
                </span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Contactar por WhatsApp</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Se oculta en la página de producto para no duplicar con el botón contextual
  if (location.pathname.startsWith('/producto/')) return null;

  const handleSelect = (sucursal) => {
    setOpen(false);
    window.open(
      buildWhatsAppLink(sucursal.phone, GENERIC_MESSAGE),
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexDirection: 'row-reverse',
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            border: 'none',
            cursor: 'pointer',
            boxShadow: hovered
              ? '0 8px 24px rgba(37, 211, 102, 0.5)'
              : '0 4px 14px rgba(37, 211, 102, 0.35)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s ease',
          }}
          aria-label="Contactar por WhatsApp"
        >
          <FaWhatsapp size={30} color="white" />
        </button>

        <span
          style={{
            backgroundColor: 'white',
            color: '#1a1a1a',
            fontSize: '13px',
            fontWeight: '500',
            padding: '6px 12px',
            borderRadius: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            whiteSpace: 'nowrap',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(10px)',
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          ¿Te ayudamos?
        </span>
      </div>

      <SucursalDialog open={open} onClose={() => setOpen(false)} onSelect={handleSelect} />
    </>
  );
};

export default WhatsAppButton;
