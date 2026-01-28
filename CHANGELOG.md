# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.01] - 2026-01-28

### ✨ Added
- **Sistema de Favoritos** - Marque músicas com ❤️ e veja sua lista de favoritos
- **Controle de Velocidade** - Reproduza em 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x ou 2x
- **Histórico de Reprodução** - Acompanhe todas as músicas que tocou
- **Estatísticas** - Veja Top 5 do Mês e Top 10 do Ano
- **Visualizador de Áudio** - 50 barras animadas na barra de progresso
- **Editor de Letras** - Sincronize letras manualmente com a música
  - Página 1: Cole a letra completa
  - Página 2: Sincronize linha por linha
  - Visualização em cascata durante reprodução
- **Leitura de Tags ID3** - Extrai automaticamente título, artista, álbum e capa
- **Tela de Estatísticas** - Visualize suas músicas mais tocadas com logo do app
- **Permissões de Arquivo** - Suporte completo para Android (READ_EXTERNAL_STORAGE, READ_MEDIA_AUDIO, MANAGE_EXTERNAL_STORAGE)

### 🔧 Technical
- Implementado `use-favorites.ts` hook para gerenciar favoritos
- Implementado `use-history.ts` hook para histórico de reprodução
- Implementado `use-lyrics-sync.ts` hook para sincronização de letras
- Implementado `use-metadata-extractor.ts` hook para leitura de tags ID3
- Criado componente `FavoriteButton` com feedback visual
- Criado componente `SpeedControl` com 7 presets
- Criado componente `AnimatedProgressBar` com visualizador
- Criado componente `LyricsDisplay` com animação em cascata
- Criado componente `LyricsEditorModal` com 2 páginas
- Criado componente `AnimatedProgressBar` com 50 barras sincronizadas
- Adicionada tela `stats.tsx` com estatísticas completas
- Integração com `id3-parser` para leitura de metadados
- AsyncStorage para persistência de dados

### 🐛 Fixed
- Corrigido problema de menu não responder no Android (Pressable com style)
- Corrigido DocumentPicker para funcionar corretamente no Android
- Corrigido tratamento de erros em operações de arquivo
- Adicionado logging detalhado para debugging

### 📚 Documentation
- Criado README.md completo com guia de uso
- Criado CONTRIBUTING.md com guia de contribuição
- Criado CHANGELOG.md (este arquivo)
- Criado LICENSE com termos Open Source personalizados

---

## [1.0.0] - 2026-01-27

### ✨ Added
- **Player de Áudio Offline** - Reproduza suas músicas sem conexão
- **Gerenciamento de Playlist** - Adicione, remova e organize músicas
- **Controles de Reprodução** - Play, Pause, Próxima, Anterior
- **Modo Shuffle** - Reprodução aleatória
- **Modo Loop** - Desligado, Uma Música, Todas as Músicas
- **Barra de Progresso** - Com seek interativo
- **Tela de Playlist** - Visualize todas as suas músicas
- **Tela de Menu** - Adicione músicas e limpe playlist
- **Tema Escuro/Claro** - Suporte automático
- **Ícone Customizado** - Logo único do app
- **Persistência Local** - Dados salvos no dispositivo
- **Suporte Multiplataforma** - iOS, Android e Web

### 🔧 Technical
- React Native 0.81 com Expo 54
- TypeScript 5.9 para tipagem estática
- Expo Audio para reprodução nativa
- Expo Router para navegação
- NativeWind 4 (Tailwind CSS)
- AsyncStorage para persistência
- React Hooks para state management

### 🎨 UI/UX
- Design responsivo para mobile (9:16 portrait)
- Compatível com one-handed usage
- Seguindo Apple Human Interface Guidelines
- Feedback visual em botões
- Animações suaves

---

## Roadmap Futuro

### Próximas Versões
- [ ] v1.1.0 - Importação de pasta inteira
- [ ] v1.2.0 - Exportar/Importar playlists (M3U, JSON)
- [ ] v1.3.0 - Busca e filtro avançado
- [ ] v2.0.0 - Temas customizáveis (skins)
- [ ] v2.1.0 - Equalizador de áudio
- [ ] v2.2.0 - Suporte a podcasts
- [ ] v3.0.0 - Sincronização com nuvem (opcional)

---

## Como Contribuir

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para instruções sobre como contribuir.

## Licença

Este projeto é licenciado sob a SimPlay Mobile Open Source License - veja [LICENSE](LICENSE) para detalhes.

---

## Agradecimentos

Obrigado a todos os contribuidores e usuários que ajudam a melhorar o SimPlay Mobile! 🎵
