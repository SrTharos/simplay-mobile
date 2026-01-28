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
