#!/bin/bash

# Script para iniciar el mockup de Guerrmo

echo "🚀 Iniciando Mockup de Guerrmo..."
echo ""

# Verificar si existe el respaldo
if [ -f "src/index-original.js" ]; then
    echo "✓ Ya existe un respaldo del index.js original"
else
    echo "📦 Creando respaldo del index.js original..."
    cp src/index.js src/index-original.js
fi

# Reemplazar index.js con el del mockup
echo "🔄 Configurando index.js para el mockup..."
cat > src/index.js << 'EOF'
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
EOF

echo "✓ Configuración completada"
echo ""
echo "📝 Instalando dependencias de Tailwind CSS..."
npm install -D @tailwindcss/postcss tailwindcss@latest postcss@latest autoprefixer@latest

echo ""
echo "✅ ¡Todo listo!"
echo ""
echo "Para iniciar el mockup ejecuta:"
echo "  npm start"
echo ""
echo "Para restaurar el proyecto original:"
echo "  ./restore-original.sh"
echo ""
