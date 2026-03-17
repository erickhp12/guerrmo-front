#!/bin/bash

# Script para restaurar el proyecto original

echo "🔄 Restaurando proyecto original..."
echo ""

if [ -f "src/index-original.js" ]; then
    cp src/index-original.js src/index.js
    echo "✅ Proyecto original restaurado"
    echo ""
    echo "Para volver al mockup ejecuta:"
    echo "  ./start-mockup.sh"
else
    echo "❌ No se encontró el respaldo del index.js original"
    echo "El archivo src/index-original.js no existe"
fi

echo ""
