# GitHub Codespace - SimPlay Mobile

## 🚀 Como Usar o Codespace

### 1. Criar um Novo Codespace

1. Vá para: https://github.com/SrTharos/simplay-mobile
2. Clique no botão verde **"Code"** (⬇️)
3. Selecione a aba **"Codespaces"**
4. Clique em **"Create codespace on main"**
5. Aguarde a inicialização (2-3 minutos)

### 2. Ambiente Pronto

O Codespace vem pré-configurado com:
- ✅ Node.js 22
- ✅ pnpm (gerenciador de pacotes)
- ✅ Git e GitHub CLI
- ✅ Expo CLI
- ✅ Extensões VSCode (ESLint, Prettier, Expo Tools)

### 3. Compilar e Executar

No terminal do Codespace, execute:

```bash
# Instalar dependências (já feito automaticamente)
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm dev

# Ou apenas Metro Bundler
pnpm dev:metro

# Ou apenas servidor API
pnpm dev:server
```

### 4. Acessar a Aplicação

Após executar `pnpm dev`, você verá:

```
Metro Bundler running on: https://8081-<seu-codespace>.github.dev
API Server running on: https://3000-<seu-codespace>.github.dev
```

**Abra a URL do Metro Bundler no navegador para ver o app!**

### 5. Testar no Celular

1. Execute `pnpm qr` para gerar QR code
2. Abra o app **Expo Go** no seu celular
3. Escaneie o QR code
4. O app carregará no seu celular em tempo real

### 6. Fazer Commits e Push

```bash
# Ver status
git status

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "feat: descrição da mudança"

# Fazer push
git push origin main
```

---

## 📊 Portas Disponíveis

| Porta | Serviço | URL |
|-------|---------|-----|
| 8081 | Metro Bundler | `https://8081-<seu-codespace>.github.dev` |
| 3000 | API Server | `https://3000-<seu-codespace>.github.dev` |
| 19000 | Expo DevTools | `https://19000-<seu-codespace>.github.dev` |
| 19001 | Expo Debugger | `https://19001-<seu-codespace>.github.dev` |

---

## 🔧 Comandos Úteis

```bash
# Verificar tipos TypeScript
pnpm check

# Lint do código
pnpm lint

# Formatar código
pnpm format

# Rodar testes
pnpm test

# Build para produção
pnpm build

# Gerar QR code
pnpm qr
```

---

## 💡 Dicas

1. **Codespace Inativo:** Se ficar inativo por 30 minutos, será pausado. Clique em "Resume" para continuar.
2. **Limite de Horas:** GitHub oferece 120 horas/mês de Codespace grátis.
3. **Deletar Codespace:** Vá para GitHub Settings → Codespaces → Delete quando terminar.
4. **Múltiplos Codespaces:** Você pode criar vários para trabalhar em branches diferentes.

---

## 🆘 Troubleshooting

### Metro Bundler não inicia
```bash
# Limpar cache
rm -rf node_modules/.cache
pnpm dev:metro
```

### Erro de permissão
```bash
# Dar permissão ao arquivo
chmod +x scripts/generate_qr.mjs
```

### Porta já em uso
```bash
# Matar processo na porta 8081
lsof -ti:8081 | xargs kill -9
```

---

## 📚 Referências

- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)

Aproveite! 🎉
