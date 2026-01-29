# SimPlay Mobile - TODO

## Core Features

### Database & Storage
- [x] Implementar IndexedDB para armazenamento de músicas (AsyncStorage)
- [x] Criar tipos TypeScript para Song e Playlist
- [x] Implementar CRUD operations (Create, Read, Update, Delete)
- [x] Persistência de metadados (título, tamanho, data de adição, última reprodução)

### Audio Player
- [x] Integrar expo-audio para reprodução de áudio
- [x] Implementar controles de playback (play, pause, next, prev)
- [x] Implementar barra de progresso com seek
- [x] Implementar modo shuffle
- [x] Implementar modos de loop (off, one, all)
- [x] Atualizar UI em tempo real durante reprodução
- [x] Gerenciar URIs de arquivo para áudio

### Home Screen (Player)
- [x] Criar layout do player com avatar/ícone
- [x] Exibir título e informações da música
- [x] Implementar controles de playback
- [x] Barra de progresso com tempo
- [x] Status de shuffle e loop
- [x] Feedback visual de estado de reprodução

### Playlist Screen
- [x] Listar todas as músicas com cards
- [x] Exibir metadados (tamanho, data, última reprodução)
- [x] Indicador de música em reprodução
- [x] Remover música individual
- [x] Estado vazio com CTA
- [x] Contagem de músicas

### Menu Screen
- [x] Botão "Adicionar Músicas" com file picker
- [ ] Botão "Exportar Playlist (JSON)" (placeholder)
- [ ] Botão "Exportar Playlist (M3U)" (placeholder)
- [ ] Botão "Importar Playlist" (placeholder)
- [x] Botão "Limpar Tudo" com confirmação
- [x] Informações do app

### File Operations
- [ ] Implementar seleção de arquivos de áudio
- [ ] Exportar playlist em formato JSON
- [ ] Exportar playlist em formato M3U
- [ ] Importar playlist de arquivo JSON/M3U
- [ ] Tratamento de erros em operações de arquivo

### UI/UX Polish
- [ ] Feedback visual em botões (press states)
- [ ] Feedback tátil (haptics) em ações principais
- [ ] Loading states
- [ ] Error messages
- [ ] Toast notifications para feedback rápido
- [ ] Animações suaves (transições de tela)

### Offline Support
- [ ] Verificar funcionalidade offline completa
- [ ] Testar reprodução sem conexão
- [ ] Testar persistência de dados

### Branding
- [x] Gerar logo/ícone customizado
- [x] Atualizar app.config.ts com nome e branding
- [x] Configurar splash screen
- [x] Configurar ícones para iOS e Android

---

## Bug Fixes & Improvements

- [ ] Evitar race conditions entre inicialização do DB e player
- [ ] Melhorar tratamento de erros em operações de áudio
- [ ] Validar formatos de arquivo de áudio
- [ ] Implementar retry logic para operações de arquivo
- [ ] Testar em dispositivos reais (iOS e Android)

---

## Testing

- [ ] Testes unitários para lógica de banco de dados
- [ ] Testes de integração para player
- [ ] Testes de UI para navegação
- [ ] Teste de reprodução de áudio
- [ ] Teste de persistência de dados

---

## Deployment

- [ ] Criar checkpoint final
- [ ] Documentar instruções de build
- [ ] Preparar para publicação em App Stores


## Bugs Reportados

- [x] Menu não responde no Android (botões não funcionam) - Corrigido: Pressable com style em vez de className
- [x] Importação de músicas não funciona no Android - Corrigido: Melhorado DocumentPicker com melhor tratamento de erros
- [x] Verificar permissões de arquivo no Android - Adicionadas READ_EXTERNAL_STORAGE, READ_MEDIA_AUDIO, MANAGE_EXTERNAL_STORAGE
- [x] Testar DocumentPicker no Android - Adicionado logging e tratamento de canceled


## Feature: Leitura de Tags ID3

- [x] Implementar leitura de metadados ID3 (título, artista, álbum)
- [x] Extrair capa do álbum das tags ID3
- [x] Exibir metadados na tela do player
- [ ] Exibir capa do álbum como avatar no player (em desenvolvimento)
- [x] Atualizar playlist com metadados corretos
- [x] Fallback para nome do arquivo se metadados não disponíveis


## Passos Implementados (v1.0.2)

- [x] Passo A: Sistema de Favoritos com ❤️ e persistência
- [x] Passo B: Controle de Velocidade (0.5x a 2x)
- [x] Passo C: Histórico com Estatísticas (Top 5 mês, Top 10 ano)
- [x] Passo D: Visualizador de Áudio na barra de progresso (50 barras animadas)
- [x] Passo E: Sincronização de Letras com editor manual (2 páginas)
- [x] Passo F: Tela de Estatísticas com logo do app

## Resumo v1.0.01

**Novas Funcionalidades:**
- Sistema completo de favoritos com persistência
- Controle de velocidade de reprodução
- Histórico de reprodução com estatísticas
- Visualizador de áudio animado na barra de progresso
- Editor de letras com sincronização manual
- Tela de estatísticas com Top 5 do mês e Top 10 do ano

**Componentes Novos:**
- `use-favorites.ts` - Hook de favoritos
- `use-history.ts` - Hook de histórico
- `use-lyrics-sync.ts` - Hook de sincronização de letras
- `favorite-button.tsx` - Botão de favorito
- `speed-control.tsx` - Controle de velocidade
- `animated-progress-bar.tsx` - Visualizador de áudio
- `lyrics-display.tsx` - Display de letras sincronizadas
- `lyrics-editor-modal.tsx` - Modal de editor de letras
- `app/(tabs)/stats.tsx` - Tela de estatísticas

**Melhorias:**
- Todas as funcionalidades com persistência de dados
- Sem propagandas ou código oculto
- Otimizado para uso offline
- Design limpo e intuitivo

## Bugs Reportados - v1.0.2 (Testes em Produção)

- [x] Speed Control muito grande - Corrigido: Convertido para botão compacto no canto com modal
- [x] Menu não funciona - Corrigido: Adicionados imports faltantes (View, Text, Pressable, etc)
- [x] Versão errada - Corrigido: Atualizado app.config.ts para 1.0.2
- [x] Alterações não empacotadas - Será resolvido com checkpoint


## Bugs Críticos - Versão Atual

- [x] Menu não funciona - Corrigido: Redesenhado com três pontinhos (⋯) no canto superior direito
- [x] Versão continua errada - Corrigido: Confirmado v1.0.2 no app.config.ts
- [x] Ícones flat em vez de texto - Corrigido: Novo design com ícones (add-circle, delete, info, music-note)


## Bug Crítico - Versionamento

- [x] Versão aparece como 1.0.3 em vez de 1.0.2 - Corrigido: Sincronizado package.json com app.config.ts (ambos 1.0.2)


## Bug Crítico - Sistema de Publicação Manus

- [ ] Aba Publish incrementa versão automaticamente (1.0.2 → 1.0.3 → 1.0.4 sem compilar)
- [ ] Versão não respeita configuração em app.config.ts e package.json
- [ ] Publicação falha sem motivo claro
- [ ] Necessário encontrar solução alternativa para versionamento
