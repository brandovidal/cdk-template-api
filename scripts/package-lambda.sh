#!/bin/bash

# Crear directorio para el paquete
mkdir -p build

# Copiar archivos necesarios
cp dist/lambda/bundle.js build/
cp package.json build/

# Instalar solo las dependencias necesarias para el runtime
cd build
npm install --production aws-sdk source-map-support

# Crear archivo zip
zip -r ../lambda-package.zip .

# Limpiar
cd ../..
rm -rf build

echo "Paquete Lambda creado en lambda-package.zip"
