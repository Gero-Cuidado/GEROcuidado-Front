#!/bin/bash
set -e  # Sai ao encontrar erros

# Valida se o Expo CLI está disponível
if ! command -v npx &> /dev/null; then
  echo "Erro: npx não está disponível."
  exit 1
fi


# Inicia o Expo CLI
env 
npx expo start -c 
