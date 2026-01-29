#!/bin/bash

# Script para sincronizar Codespace com a versão correta
# Execute isso no Codespace quando notar que a versão está desatualizada

echo "🔄 Sincronizando Codespace com repositório..."

# Limpar cache
rm -rf node_modules/.cache 2>/dev/null
rm -rf .expo 2>/dev/null

# Atualizar repositório
git fetch origin
git pull origin main

# Limpar e reinstalar dependências
echo "📦 Reinstalando dependências..."
pnpm install

# Verificar versão
echo "✅ Versão atual:"
cat package.json | grep version

echo "🚀 Codespace sincronizado! Execute: pnpm dev"
