# 🎵 SimPlay Mobile - Simple Player Offline

Um **reprodutor de áudio offline** minimalista, rápido e totalmente gratuito para Android e iOS. Toque suas músicas locais sem internet, sem propagandas e sem código oculto consumindo bateria.

**Versão Atual:** v1.0.2 | **Status:** Estável | **Licença:** Open Source (Uso Livre)

---

## ✨ Funcionalidades Principais

### 🎵 Reprodução de Áudio
- Player completo com controles de play, pause, próxima, anterior
- Barra de progresso animada com visualizador de áudio (50 barras)
- Controle de velocidade (0.5x a 2x) com botão compacto no canto
- Modos de loop (off, one, all)
- Shuffle para reprodução aleatória
- Suporte a múltiplos formatos (MP3, M4A, WAV, OGG, FLAC)

### 📝 Metadados ID3
- Leitura automática de tags ID3 (título, artista, álbum)
- Extração de capa do álbum das tags
- Editor de metadados com sincronização manual

### 📋 Gerenciamento de Playlist
- Adicionar músicas via seletor de arquivo
- Remover músicas individualmente
- Favoritos (❤️) com persistência
- Histórico de reprodução com estatísticas
- Top 5 do Mês e Top 10 do Ano

### 🎤 Letras Sincronizadas
- Editor de letras com 2 páginas (edição + sincronização)
- Sincronização manual linha por linha
- Botão "Voltar ao Tempo" para revisar e preparar
- Visualização animada em cascata durante reprodução
- Suporte a campo LYRICS das tags ID3

### ⚙️ Menu Intuitivo
- Três pontinhos (⋯) no canto superior direito
- Ícones flat para melhor UX
- Opções: Adicionar músicas, limpar playlist, sobre o app

### 🌙 Experiência do Usuário
- Dark mode automático baseado no tema do sistema
- Design responsivo otimizado para mobile (9:16 portrait)
- Sem propagandas ou código oculto
- 100% offline - funciona sem internet
- Persistência local via AsyncStorage

---

## 📦 Instalação

### Via GitHub Releases (Recomendado)
1. Vá para: [Releases](https://github.com/SrTharos/simplay-mobile/releases)
2. Baixe o APK mais recente (Android) ou IPA (iOS)
3. Instale no seu dispositivo

### Via Expo Go (Desenvolvimento)
1. Instale [Expo Go](https://expo.dev/go) no seu celular
2. Escaneie o QR code do projeto
3. Ou use: `pnpm dev` e acesse via Metro Bundler

### Via GitHub Codespace (Compilação Online)
1. Vá para: [Repositório](https://github.com/SrTharos/simplay-mobile)
2. Clique em **"Code"** → **"Codespaces"** → **"Create codespace on main"**
3. No terminal: `bash sync-codespace.sh && pnpm dev`
4. Acesse via Expo Go ou Metro Bundler

---

## 🚀 Primeiros Passos

### 1. Adicionar Músicas
- Toque o ícone ➕ no menu (três pontinhos)
- Selecione um ou mais arquivos de áudio
- As músicas aparecerão na aba Playlist

### 2. Reproduzir
- Toque uma música na playlist
- Use os controles na aba Player
- Ajuste velocidade com o botão 1x no canto

### 3. Editar Metadados (Opcional)
- Toque uma música
- Clique em "Editar Letras" para adicionar/sincronizar
- Ou use o menu para editar informações

### 4. Acompanhar Estatísticas
- Vá para a aba Estatísticas
- Veja seu Top 5 do Mês e Top 10 do Ano
- Compartilhe seu gosto musical

---

## 🏗️ Estrutura do Projeto

```
simplay-mobile/
├── app/                          # Telas e rotas (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx            # Tela do Player
│   │   ├── playlist.tsx         # Tela de Playlist
│   │   ├── stats.tsx            # Tela de Estatísticas
│   │   └── _layout.tsx          # Layout de abas
│   └── _layout.tsx              # Layout raiz
├── components/                   # Componentes reutilizáveis
│   ├── screen-container.tsx     # SafeArea wrapper
│   ├── speed-control.tsx        # Botão de velocidade
│   ├── animated-progress-bar.tsx # Barra com visualizador
│   ├── favorite-button.tsx      # Botão de favorito
│   ├── lyrics-display.tsx       # Exibição de letras
│   ├── lyrics-editor-modal.tsx  # Editor de letras
│   └── ui/
│       └── icon-symbol.tsx      # Mapeamento de ícones
├── hooks/                        # Hooks customizados
│   ├── use-player.ts            # Gerenciamento de áudio
│   ├── use-favorites.ts         # Sistema de favoritos
│   ├── use-history.ts           # Histórico e estatísticas
│   ├── use-lyrics-sync.ts       # Sincronização de letras
│   └── use-metadata-extractor.ts # Extração de ID3
├── types/                        # Tipos TypeScript
│   └── index.ts                 # Definições de tipos
├── lib/                          # Utilitários
│   ├── utils.ts                 # Funções auxiliares
│   ├── theme-provider.tsx       # Contexto de tema
│   └── _core/                   # Núcleo de tema
├── assets/                       # Imagens e ícones
│   └── images/
│       ├── icon.png             # Ícone do app
│       ├── splash-icon.png      # Splash screen
│       └── favicon.png          # Favicon
├── app.config.ts                # Configuração Expo
├── tailwind.config.js           # Configuração Tailwind
├── theme.config.js              # Paleta de cores
└── package.json                 # Dependências
```

---

## 🛠️ Tecnologias

React Native 0.81 com Expo 54 fornece a base do app. TypeScript garante tipagem estática e melhor experiência de desenvolvimento. Expo Router gerencia navegação entre telas. NativeWind integra Tailwind CSS para styling responsivo. Expo Audio oferece reprodução de áudio nativa otimizada. id3-parser extrai metadados de arquivos de áudio. AsyncStorage persiste dados localmente no dispositivo. Expo Haptics fornece feedback tátil em interações principais.

---

## 📱 Compatibilidade

O app foi testado em Android 7.0+ (API 24) e é suportado em iOS 13.0+. Web oferece suporte limitado para desenvolvimento.

---

## 🎯 Roadmap Futuro

**v1.1** incluirá importação de pasta inteira, exportar/importar playlists (M3U, JSON) e busca avançada. **v1.2** adicionará temas customizáveis, imagens de presentes visuais e suporte a múltiplas playlists. **v2.0** trará sincronização com nuvem (opcional), equalizador 10-band, gapless playback e gestos de controle.

---

## 🐛 Problemas Conhecidos

O menu foi corrigido em v1.0.2 para funcionar perfeitamente no Android. Versão incrementa automaticamente na aba Publish (bug do Manus) - recomenda-se usar GitHub Releases. Codespace pode ter cache desatualizado - execute `bash sync-codespace.sh`.

---

## 📖 Documentação

Consulte [QUICK_START.md](./QUICK_START.md) para guia rápido (5 minutos), [USAGE.md](./USAGE.md) para guia completo, [CONTRIBUTING.md](./CONTRIBUTING.md) para contribuições, [CHANGELOG.md](./CHANGELOG.md) para histórico de versões, [PUBLISH_TROUBLESHOOTING.md](./PUBLISH_TROUBLESHOOTING.md) para problemas de publicação, e [CODESPACE_SETUP.md](./CODESPACE_SETUP.md) para setup do GitHub Codespace.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga o [CONTRIBUTING.md](./CONTRIBUTING.md) para reportar bugs, sugerir features, submeter pull requests ou melhorar documentação. Use [Conventional Commits](https://www.conventionalcommits.org/) para commits.

---

## 📄 Licença

**SimPlay Mobile** é Open Source sob licença personalizada. **Permitido:** usar gratuitamente, modificar código, distribuir cópias, usar comercialmente (com atribuição). **Não Permitido:** rebranding sem atribuição, remover créditos originais, vender como seu próprio trabalho. Veja [LICENSE](./LICENSE) para detalhes completos.

---

## 🙏 Agradecimentos

Obrigado a Expo, React Native, NativeWind e à comunidade Open Source por inspiração e suporte.

---

## 📞 Suporte

Abra uma [issue no GitHub](https://github.com/SrTharos/simplay-mobile/issues) para reportar bugs ou sugerir features.

---

## 🌟 Dê uma Estrela!

Se você gosta do SimPlay Mobile, considere dar uma ⭐ no [GitHub](https://github.com/SrTharos/simplay-mobile)! Isso ajuda a divulgar o projeto e motiva o desenvolvimento contínuo.

---

**Desenvolvido com ❤️ para amantes de música offline**

*Última atualização: Janeiro 2026 | v1.0.2*
