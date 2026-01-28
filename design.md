# SimPlay Mobile - Design Document

## Overview
SimPlay Mobile é um reprodutor de áudio offline otimizado para dispositivos móveis. Oferece gerenciamento de playlists, reprodução com controles intuitivos e sincronização local de dados via IndexedDB.

---

## Screen List

### 1. **Home Screen (Player)**
- Reprodutor principal com visualização da música em reprodução
- Controles de playback (play, pause, próxima, anterior)
- Barra de progresso com duração
- Modo shuffle e loop
- Acesso ao menu de gerenciamento

### 2. **Playlist Screen**
- Lista de todas as músicas adicionadas
- Contagem de músicas
- Busca/filtro de músicas
- Ações: remover música individual
- Indicador de música em reprodução

### 3. **Menu/Settings Screen**
- Adicionar músicas (file picker)
- Exportar playlist (JSON, M3U)
- Importar playlist
- Limpar tudo com confirmação
- Informações do app

---

## Primary Content and Functionality

### Home Screen
**Content:**
- Avatar/ícone de música grande (visual feedback)
- Título da música em reprodução
- Informações: número da música / total, tamanho do arquivo
- Barra de progresso com tempo atual e duração
- Botões de controle em linha: shuffle, anterior, play/pause, próxima, loop

**Functionality:**
- Play/pause toggle
- Navegar entre músicas (anterior/próxima)
- Buscar na barra de progresso
- Ativar/desativar shuffle
- Ciclar entre modos de loop (off → one → all)

### Playlist Screen
**Content:**
- Cards de música com:
  - Ícone de status (tocando/pausado)
  - Título e tamanho do arquivo
  - Data de adição e última reprodução
  - Botão de remover (X)
- Estado vazio com mensagem e CTA

**Functionality:**
- Tocar música ao clicar no card
- Remover música individualmente
- Indicador visual da música em reprodução

### Menu Screen
**Content:**
- Botões de ação:
  - Adicionar Músicas
  - Exportar Playlist (JSON)
  - Exportar Playlist (M3U)
  - Importar Playlist
  - Limpar Tudo (com confirmação)

**Functionality:**
- File picker para adicionar/importar
- Gerar e compartilhar arquivos de exportação
- Confirmação antes de ações destrutivas

---

## Key User Flows

### Flow 1: Adicionar e Tocar Música
1. Usuário toca "Adicionar Músicas" no menu
2. File picker abre
3. Usuário seleciona um ou mais arquivos de áudio
4. Músicas são armazenadas no IndexedDB
5. Playlist é atualizada
6. Usuário toca em uma música para começar a reprodução

### Flow 2: Controlar Reprodução
1. Usuário toca play/pause
2. Ícone muda para indicar estado
3. Barra de progresso avança em tempo real
4. Usuário pode buscar clicando na barra
5. Ao final, próxima música toca automaticamente (se loop all ativo)

### Flow 3: Gerenciar Playlist
1. Usuário acessa a aba de Playlist
2. Vê todas as músicas com metadados
3. Pode remover individual (X button)
4. Ou limpar tudo via menu (com confirmação)
5. Dados persistem no IndexedDB

### Flow 4: Exportar/Importar
1. Usuário toca "Exportar Playlist (JSON)"
2. Arquivo é gerado e oferecido para download
3. Usuário pode compartilhar ou salvar
4. Para importar, toca "Importar Playlist"
5. Seleciona arquivo JSON/M3U
6. Dados são mesclados ou substituem existentes

---

## Color Choices

**Brand Palette (Inspired by Original SimPlay-O):**

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| **Primary** | `#0a7ea4` | `#0a7ea4` | Botões, ícones ativos, accents |
| **Background** | `#ffffff` | `#151718` | Fundo geral |
| **Surface** | `#f5f5f5` | `#1e2022` | Cards, superfícies elevadas |
| **Foreground** | `#11181C` | `#ECEDEE` | Texto principal |
| **Muted** | `#687076` | `#9BA1A6` | Texto secundário, subtítulos |
| **Border** | `#E5E7EB` | `#334155` | Divisores, bordas |
| **Success** | `#22C55E` | `#4ADE80` | Feedback positivo |
| **Warning** | `#F59E0B` | `#FBBF24` | Avisos |
| **Error** | `#EF4444` | `#F87171` | Erros, ações destrutivas |

**Music-Specific Colors:**
- **Now Playing Indicator**: `#4ecdc4` (teal) - destaque para música em reprodução
- **Loop One**: `#ff2e63` (pink) - modo de repetição única
- **Loop All**: `#00adb5` (cyan) - modo de repetição de playlist

---

## Layout Principles

- **Portrait Orientation**: Otimizado para 9:16 (padrão mobile)
- **One-Handed Usage**: Controles principais na metade inferior da tela
- **Safe Area**: Respeita notches e home indicators (iOS/Android)
- **Tab Bar**: Navegação fixa entre Home, Playlist, Menu
- **Responsive**: Adapta-se a diferentes tamanhos de tela

---

## Navigation Structure

```
App
├── (tabs)
│   ├── index.tsx (Home - Player)
│   ├── playlist.tsx (Playlist)
│   └── menu.tsx (Menu/Settings)
└── oauth/ (Auth callbacks)
```

Tab bar com 3 abas:
- 🎵 Home (Player)
- 📋 Playlist
- ⚙️ Menu
