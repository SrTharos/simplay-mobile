# 🎵 SimPlay Mobile - Simple Player Offline

Um player de áudio offline moderno, rápido e sem propagandas, construído com React Native + Expo. Perfeito para ouvir sua música favorita em qualquer lugar, sem necessidade de conexão com a internet.

## ✨ Funcionalidades

### Core
- 🎵 **Reprodução de Áudio** - Suporte para MP3 e outros formatos de áudio
- 📋 **Gerenciamento de Playlist** - Adicione, remova e organize suas músicas
- 🏷️ **Leitura de Tags ID3** - Extrai automaticamente título, artista, álbum e capa
- 💾 **Persistência Local** - Todos os dados salvos localmente no dispositivo

### Funcionalidades Avançadas (v1.0.01)
- ❤️ **Favoritos** - Marque suas músicas favoritas com um toque
- 🎚️ **Controle de Velocidade** - Reproduza em 0.5x a 2x velocidade
- 📊 **Histórico + Estatísticas** - Veja suas Top 5 do mês e Top 10 do ano
- 🎵 **Visualizador de Áudio** - 50 barras animadas na barra de progresso
- 📝 **Editor de Letras** - Sincronize letras manualmente com a música
- 📈 **Tela de Estatísticas** - Acompanhe suas músicas mais tocadas

### Controles de Reprodução
- ⏯️ Play/Pause
- ⏭️ Próxima/Anterior
- 🔀 Shuffle (Aleatório)
- 🔁 Loop (Desligado/Uma/Todas)
- ⏱️ Seek (Pular para qualquer posição)

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Um dispositivo Android/iOS ou emulador

### Instalação

```bash
# Clonar repositório
git clone https://github.com/SrTharos/simplay-mobile.git
cd simplay-mobile

# Instalar dependências
pnpm install

# Iniciar desenvolvimento
pnpm dev
```

### Executar no Dispositivo

**Android:**
```bash
pnpm android
```

**iOS:**
```bash
pnpm ios
```

**Web:**
```bash
pnpm dev:metro
```

## 📁 Estrutura do Projeto

```
simplay-mobile/
├── app/                          # Rotas e telas
│   ├── (tabs)/
│   │   ├── index.tsx            # Tela do Player
│   │   ├── playlist.tsx         # Tela da Playlist
│   │   ├── stats.tsx            # Tela de Estatísticas
│   │   └── menu.tsx             # Tela do Menu
│   └── _layout.tsx              # Layout raiz
├── components/                   # Componentes reutilizáveis
│   ├── favorite-button.tsx
│   ├── speed-control.tsx
│   ├── animated-progress-bar.tsx
│   ├── lyrics-display.tsx
│   └── lyrics-editor-modal.tsx
├── hooks/                        # Hooks customizados
│   ├── use-player.ts            # Lógica do player
│   ├── use-favorites.ts         # Gerenciamento de favoritos
│   ├── use-history.ts           # Histórico de reprodução
│   ├── use-lyrics-sync.ts       # Sincronização de letras
│   └── use-metadata-extractor.ts # Extração de metadados ID3
├── types/                        # Tipos TypeScript
├── assets/                       # Ícones e imagens
└── app.config.ts                # Configuração do Expo
```

## 🎯 Como Usar

### Adicionar Músicas
1. Vá para a aba **Menu**
2. Clique em **"Adicionar Músicas"**
3. Selecione um ou mais arquivos de áudio
4. As músicas serão adicionadas à sua playlist automaticamente

### Reproduzir Música
1. Vá para a aba **Player**
2. Clique em uma música na playlist ou use os botões de controle
3. Use os botões para controlar a reprodução

### Adicionar Letras
1. Na aba **Player**, clique em **"Adicionar Letras"**
2. **Página 1:** Cole a letra completa
3. **Página 2:** Sincronize cada linha manualmente
   - Clique Play
   - Quando a linha começar, clique **"⏱️ Marcar"**
   - Se errou, clique **"↩️ Voltar"** para revisar

### Ver Estatísticas
1. Vá para a aba **Estatísticas**
2. Veja suas Top 5 do Mês e Top 10 do Ano
3. Clique em qualquer música para reproduzi-la

## 🛠️ Tecnologias

- **React Native** 0.81 - Framework mobile
- **Expo** 54 - Plataforma de desenvolvimento
- **TypeScript** 5.9 - Tipagem estática
- **Expo Audio** - Reprodução de áudio nativo
- **Expo Router** - Navegação
- **NativeWind** 4 - Tailwind CSS para React Native
- **AsyncStorage** - Persistência local
- **id3-parser** - Leitura de tags ID3

## 📊 Estrutura de Dados

### Song
```typescript
interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  size: number;
  uri: string;
  added: string; // ISO timestamp
}
```

### PlayHistory
```typescript
interface PlayHistory {
  songId: string;
  playedAt: string; // ISO timestamp
  duration: number;
  completedPercent: number;
}
```

### SyncedLyric
```typescript
interface SyncedLyric {
  text: string;
  timeMs: number;
}
```

## 🔒 Privacidade & Segurança

- ✅ **100% Offline** - Nenhum dado é enviado para servidores
- ✅ **Sem Propagandas** - Nenhuma publicidade ou rastreamento
- ✅ **Sem Código Oculto** - Código aberto e auditável
- ✅ **Persistência Local** - Todos os dados salvos no dispositivo

## 📝 Licença

MIT - Veja LICENSE para detalhes

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para reportar bugs ou sugerir funcionalidades, abra uma issue no GitHub.

## 🗺️ Roadmap

- [ ] Importar pasta inteira de músicas
- [ ] Exportar/Importar playlists (M3U, JSON)
- [ ] Busca e filtro avançado
- [ ] Temas (skins) customizáveis
- [ ] Sincronização com nuvem (opcional)
- [ ] Suporte a podcasts
- [ ] Equalizador de áudio

## 📈 Versões

### v1.0.01 (Atual)
- ✅ Favoritos com persistência
- ✅ Controle de velocidade
- ✅ Histórico + Estatísticas
- ✅ Visualizador de áudio animado
- ✅ Editor de letras com sincronização
- ✅ Tela de estatísticas

### v1.0.0 (Inicial)
- ✅ Player básico
- ✅ Gerenciamento de playlist
- ✅ Leitura de tags ID3
- ✅ Controles de reprodução
- ✅ Modo offline completo

---

**Desenvolvido com ❤️ para os amantes de música offline**
