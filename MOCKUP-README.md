# Guerrmo - Mockup Frontend Profesional

Mockup frontend profesional para refaccionaria "Guerrmo" - Sistema de pedidos sin pagos en línea, enfocado en SEO local y captación de clientes en Ciudad Juárez.

## 🎯 Objetivo del Mockup

Este mockup está diseñado para mostrar al dueño del negocio cómo puede evolucionar su sistema en una segunda etapa, enfocándose en:

1. **SEO Local** - Aparecer más fácilmente en Google dentro de Ciudad Juárez
2. **Catálogo Mejorado** - Presentación profesional de productos
3. **Sistema de Pedidos** - Permitir pedidos desde la web SIN pagos en línea
4. **Panel Administrativo** - Gestión básica de pedidos

## 🚀 Características

### Pantallas Incluidas

1. **Home / Landing** - Página principal atractiva con:
   - Hero con mensaje de negocio local
   - Buscador de productos
   - Categorías destacadas
   - Productos destacados
   - Beneficios del negocio
   - Sección "Cómo funciona"
   - Cobertura local (Ciudad Juárez)
   - Roadmap de crecimiento (Mes 1-6)

2. **Catálogo de Productos** - Con:
   - Grid de productos con datos mock
   - Filtros por categoría
   - Buscador
   - Tarjetas de producto modernas
   - Botones "Ver detalle" y "Agregar al pedido"

3. **Detalle de Producto** - Incluye:
   - Imagen del producto
   - Información completa (SKU, marca, descripción)
   - Compatibilidad
   - Precio
   - Selector de cantidad
   - Productos relacionados

4. **Pedido / Carrito** - Sistema sin pagos:
   - Lista de productos agregados
   - Resumen del pedido
   - Formulario del cliente (nombre, teléfono, email, dirección)
   - Botón "Enviar pedido"
   - Confirmación mock

5. **Panel Administrativo** - Demo visual:
   - Cards con estadísticas (nuevos, en proceso, entregados)
   - Tabla de pedidos mock
   - Filtros por estado
   - Buscador

## 📦 Tecnologías

- **React** 16.14.0
- **React Router** 5.2.1
- **Tailwind CSS** (nuevo)
- **Datos Mock** - JSON estático, sin backend

## 🛠️ Instalación

### 1. Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 2. Configurar PostCSS

Crea el archivo `postcss.config.js` en la raíz:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Actualizar package.json

El proyecto ya incluye las dependencias necesarias. Solo asegúrate de tener instalado:

```bash
npm install
```

## 🎨 Ejecutar el Mockup

### Opción 1: Reemplazar index.js temporalmente

```bash
# Respalda el index.js original
mv src/index.js src/index-original.js

# Usa el index del mockup
mv src/index-mockup.js src/index.js

# Ejecuta el proyecto
npm start
```

### Opción 2: Modificar index.js manualmente

Reemplaza el contenido de `src/index.js` con:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import MockupRoutes from "./mockupRoutes";
import "./tailwind.css";

ReactDOM.render(
  <HashRouter>
    <MockupRoutes />
  </HashRouter>,
  document.getElementById("root")
);
```

Luego ejecuta:

```bash
npm start
```

## 📁 Estructura de Archivos Nuevos

```
src/
├── mockData.js                      # Datos mock (productos, pedidos, categorías)
├── mockupRoutes.js                  # Rutas del mockup
├── index-mockup.js                  # Entry point alternativo
├── tailwind.css                     # Imports de Tailwind
└── views/
    └── Mockup/
        ├── Home.js                  # Landing principal
        ├── Catalogo.js              # Catálogo de productos
        ├── ProductoDetalle.js       # Detalle de producto
        ├── Pedido.js                # Carrito y formulario
        └── AdminPanel.js            # Panel administrativo

tailwind.config.js                   # Configuración de Tailwind
```

## 🎯 Datos Mock Incluidos

### Productos (12 productos de ejemplo)
- Balatas cerámicas
- Filtros de aceite
- Amortiguadores
- Baterías
- Bujías
- Bombas de agua
- Kit de clutch
- Radiadores
- Y más...

### Categorías (8 categorías)
- Frenos
- Filtros
- Suspensión
- Sistema Eléctrico
- Motor
- Sistema de Enfriamiento
- Transmisión
- Dirección

### Pedidos Mock (5 pedidos de ejemplo)
Con diferentes estados: nuevo, en proceso, entregado

## 🌐 Rutas del Mockup

- `/` - Home / Landing
- `/catalogo` - Catálogo de productos
- `/producto/:id` - Detalle de producto
- `/pedido` - Carrito y formulario de pedido
- `/admin` - Panel administrativo

## 💡 Características Destacadas

### SEO Local
- Textos optimizados para "Refacciones en Ciudad Juárez"
- Menciones de zonas: Centro, Juriquilla, El Refugio, Corregidora
- Enfoque en búsqueda local

### Sin Pagos en Línea
- No hay integración con Stripe ni pasarelas
- Sistema de pedidos por formulario
- Confirmación por contacto directo

### Diseño Profesional
- Colores corporativos (rojo #ef4444)
- Componentes modernos con Tailwind
- Responsive design
- Animaciones sutiles
- Iconos y emojis para mejor UX

### Roadmap de Crecimiento
Muestra visualmente cómo puede evolucionar:
- **Mes 1-3**: SEO local, catálogo, pedidos básicos
- **Mes 4-5**: Historial, clientes frecuentes, SEO avanzado
- **Mes 6+**: Seguimiento en tiempo real, reportes, app móvil

## 🚀 Despliegue

### Vercel (Recomendado)

1. Sube el proyecto a GitHub
2. Conecta con Vercel
3. Configura el build:
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Despliega

### Netlify

1. Sube el proyecto a GitHub
2. Conecta con Netlify
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Despliega

## 📝 Notas Importantes

### Para el Dueño del Negocio

Este mockup es una **propuesta visual** que muestra:

✅ Cómo se vería el sitio en la siguiente etapa
✅ Cómo captar clientes locales con SEO
✅ Cómo recibir pedidos sin invertir en pagos en línea
✅ Cómo gestionar pedidos de forma simple
✅ Cómo puede crecer el sistema paso a paso

❌ NO incluye:
- Backend funcional
- Base de datos real
- Integración con inventario
- Pagos en línea
- Envío de emails automáticos

### Próximos Pasos Reales

1. **Mes 1**: Implementar backend básico (Django/Python)
2. **Mes 2**: Conectar con base de datos real
3. **Mes 3**: Sistema de notificaciones (email/WhatsApp)
4. **Mes 4**: Integración con inventario
5. **Mes 5**: SEO técnico y contenido optimizado
6. **Mes 6**: Analytics y reportes

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Cambia estos valores
        600: '#tu-color',
      },
    },
  },
}
```

### Agregar Más Productos

Edita `src/mockData.js` y agrega objetos al array `mockProducts`.

### Modificar Textos

Todos los textos están en español y pueden editarse directamente en cada componente.

## 📞 Soporte

Para dudas sobre el mockup o implementación real, contacta al equipo de desarrollo.

## 📄 Licencia

Este mockup es propiedad de Guerrmo y está diseñado exclusivamente para demostración interna.

---

**Desarrollado con ❤️ para Guerrmo - Refacciones en Ciudad Juárez**
