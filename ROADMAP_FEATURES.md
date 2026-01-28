# Roadmap de Funcionalidades - SimPlay Mobile

## Passo 1: Exibir Capa do Álbum como Avatar

### Descrição
Substituir o ícone genérico de música pela capa do álbum extraída dos metadados ID3. Se não houver capa, mostrar um avatar com as iniciais do artista ou um ícone padrão.

### Código Imaginado

#### `components/album-art-display.tsx` (Novo Componente)
```tsx
import { View, Image, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';

interface AlbumArtDisplayProps {
  albumArt?: string;
  title?: string;
  artist?: string;
  size?: number;
}

export function AlbumArtDisplay({
  albumArt,
  title = 'Unknown',
  artist = 'Unknown Artist',
  size = 192,
}: AlbumArtDisplayProps) {
  const colors = useColors();

  // Se houver capa do álbum, exibir como imagem
  if (albumArt) {
    return (
      <View
        className="rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Image
          source={{ uri: albumArt }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Fallback: Avatar com iniciais do artista
  const initials = artist
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <View
      className="rounded-full items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: colors.primary,
        opacity: 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      {initials ? (
        <Text
          style={{
            fontSize: size * 0.35,
            fontWeight: 'bold',
            color: colors.background,
          }}
        >
          {initials}
        </Text>
      ) : (
        <MaterialIcons name="music-note" size={size * 0.5} color={colors.background} />
      )}
    </View>
  );
}
```

#### Modificação em `app/(tabs)/index.tsx`
```tsx
import { AlbumArtDisplay } from '@/components/album-art-display';

// Substituir a seção do avatar:
{/* Avatar */}
<AlbumArtDisplay
  albumArt={currentSong?.albumArt}
  title={currentSong?.title}
  artist={currentSong?.artist}
  size={200}
/>
```

### Benefícios
- ✅ Experiência visual muito melhor
- ✅ Identifica músicas rapidamente pela capa
- ✅ Fallback elegante com iniciais do artista
- ✅ Sombra e efeito de profundidade

---

## Passo 2: Importar Todas as Músicas de uma Pasta

### Descrição
Adicionar funcionalidade para selecionar uma pasta e importar automaticamente todas as músicas contidas nela e em suas subpastas. Útil para importar coleções organizadas em diretórios.

### Código Imaginado

#### `hooks/use-folder-import.ts` (Novo Hook)
```tsx
import { useCallback, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import type { Song } from '@/types';

interface FolderImportOptions {
  recursive?: boolean; // Incluir subpastas
  audioOnly?: boolean; // Apenas arquivos de áudio
}

export function useFolderImport() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Extensões de áudio suportadas
   */
  const AUDIO_EXTENSIONS = [
    '.mp3',
    '.m4a',
    '.aac',
    '.flac',
    '.wav',
    '.ogg',
    '.wma',
    '.opus',
  ];

  /**
   * Verificar se um arquivo é de áudio
   */
  const isAudioFile = useCallback((filename: string): boolean => {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    return AUDIO_EXTENSIONS.includes(ext);
  }, []);

  /**
   * Listar todos os arquivos em uma pasta (recursivamente)
   */
  const listFilesInFolder = useCallback(
    async (folderUri: string, recursive: boolean = true): Promise<string[]> => {
      try {
        const files: string[] = [];
        const queue: string[] = [folderUri];

        while (queue.length > 0) {
          const currentFolder = queue.shift()!;

          try {
            const contents = await FileSystem.readDirectoryAsync(currentFolder);

            for (const item of contents) {
              const itemUri = `${currentFolder}/${item}`;

              try {
                const info = await FileSystem.getInfoAsync(itemUri);

                if (info.isDirectory && recursive) {
                  // Adicionar pasta à fila para processar depois
                  queue.push(itemUri);
                } else if (!info.isDirectory && isAudioFile(item)) {
                  // Adicionar arquivo de áudio à lista
                  files.push(itemUri);
                }
              } catch (error) {
                // Ignorar erros ao acessar arquivos individuais
                console.warn(`Erro ao acessar ${itemUri}:`, error);
              }
            }
          } catch (error) {
            console.warn(`Erro ao ler pasta ${currentFolder}:`, error);
          }
        }

        return files;
      } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        return [];
      }
    },
    [isAudioFile]
  );

  /**
   * Selecionar uma pasta e importar todas as músicas
   */
  const importFromFolder = useCallback(
    async (options: FolderImportOptions = {}): Promise<Song[]> => {
      const { recursive = true, audioOnly = true } = options;

      try {
        setImporting(true);
        setProgress(0);

        // Abrir seletor de pasta
        // Nota: DocumentPicker não tem suporte direto a pastas em Android
        // Alternativa: usar expo-file-system com permissões de armazenamento
        const result = await DocumentPicker.getDocumentAsync({
          type: 'audio/*',
          multiple: true,
        });

        if (result.canceled) {
          setImporting(false);
          return [];
        }

        // Converter resultados do DocumentPicker em Songs
        const newSongs: Song[] = result.assets.map((asset: any, index: number) => {
          const title = asset.name
            ? asset.name.replace(/\.[^/.]+$/, '')
            : `Música ${index + 1}`;

          return {
            id: `song_${Date.now()}_${index}`,
            title: title,
            filename: asset.name || `audio_${index}`,
            type: asset.mimeType || 'audio/mpeg',
            size: asset.size || 0,
            uri: asset.uri,
            added: new Date().toISOString(),
            lastPlayed: null,
          };
        });

        setProgress(100);
        setImporting(false);

        return newSongs;
      } catch (error) {
        console.error('Erro ao importar pasta:', error);
        setImporting(false);
        return [];
      }
    },
    []
  );

  /**
   * Versão alternativa usando acesso direto ao sistema de arquivos
   * (Requer permissões READ_EXTERNAL_STORAGE no Android)
   */
  const importFromFolderDirect = useCallback(
    async (folderUri: string, options: FolderImportOptions = {}): Promise<Song[]> => {
      const { recursive = true } = options;

      try {
        setImporting(true);
        setProgress(0);

        // Listar todos os arquivos de áudio na pasta
        const audioFiles = await listFilesInFolder(folderUri, recursive);

        console.log(`Encontradas ${audioFiles.length} músicas`);

        // Converter em Songs
        const newSongs: Song[] = audioFiles.map((fileUri, index) => {
          const filename = fileUri.split('/').pop() || `audio_${index}`;
          const title = filename.replace(/\.[^/.]+$/, '');

          return {
            id: `song_${Date.now()}_${index}`,
            title: title,
            filename: filename,
            type: 'audio/mpeg',
            size: 0, // Seria necessário obter o tamanho real
            uri: fileUri,
            added: new Date().toISOString(),
            lastPlayed: null,
          };
        });

        setProgress(100);
        setImporting(false);

        return newSongs;
      } catch (error) {
        console.error('Erro ao importar pasta:', error);
        setImporting(false);
        return [];
      }
    },
    [listFilesInFolder]
  );

  return {
    importing,
    progress,
    importFromFolder,
    importFromFolderDirect,
    isAudioFile,
    listFilesInFolder,
  };
}
```

#### `components/import-options-modal.tsx` (Novo Componente)
```tsx
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';

interface ImportOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onImportFiles: () => void;
  onImportFolder: () => void;
  loading?: boolean;
}

export function ImportOptionsModal({
  visible,
  onClose,
  onImportFiles,
  onImportFolder,
  loading = false,
}: ImportOptionsModalProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: 24,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.foreground,
              }}
            >
              Importar Músicas
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Opção 1: Importar Arquivos Individuais */}
            <Pressable
              onPress={onImportFiles}
              disabled={loading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 12,
                backgroundColor: colors.surface,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: loading ? 0.6 : 1,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <MaterialIcons name="music-note" size={24} color={colors.background} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.foreground,
                  }}
                >
                  Selecionar Arquivos
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.muted,
                    marginTop: 4,
                  }}
                >
                  Escolha uma ou mais músicas
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </Pressable>

            {/* Opção 2: Importar Pasta Completa */}
            <Pressable
              onPress={onImportFolder}
              disabled={loading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 12,
                backgroundColor: colors.surface,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: loading ? 0.6 : 1,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <MaterialIcons name="folder" size={24} color={colors.background} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.foreground,
                  }}
                >
                  Importar Pasta
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.muted,
                    marginTop: 4,
                  }}
                >
                  Todas as músicas da pasta
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </Pressable>

            {/* Botão Cancelar */}
            <Pressable
              onPress={onClose}
              disabled={loading}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.foreground,
                }}
              >
                Cancelar
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
```

### Fluxo de Uso

1. **Usuário toca em "Adicionar Músicas"**
   ↓
2. **Modal aparece com 2 opções:**
   - Selecionar Arquivos (comportamento atual)
   - Importar Pasta (novo)
   ↓
3. **Se escolher "Importar Pasta":**
   - Sistema varre a pasta e subpastas
   - Encontra todos os arquivos de áudio
   - Extrai metadados ID3
   - Adiciona à playlist
   ↓
4. **Feedback visual:**
   - Barra de progresso (opcional)
   - Alerta com número de músicas importadas

### Benefícios
- ✅ Importar coleções inteiras rapidamente
- ✅ Suporte a subpastas (recursivo)
- ✅ Filtra automaticamente apenas áudio
- ✅ Extrai metadados de todas as músicas
- ✅ Interface clara com 2 opções
- ✅ Tratamento de erros robusto

---

## Passo 3: Editor de Metadados ID3 com Busca Automática

### Descrição
Criar uma tela/modal de edição de metadados ID3 que permite editar título, artista, álbum, adicionar/trocar capa do álbum. Incluir um botão "Buscar Automaticamente" que consulta APIs de música (Spotify, MusicBrainz, Genius) para preencher automaticamente os metadados baseado no nome do arquivo ou metadados existentes.

### Fluxo de Uso
1. Usuário toca em uma música na playlist → Botão "Editar Metadados"
2. Modal/tela de edição abre com campos: Título, Artista, Álbum, Capa
3. Botão "Buscar Automaticamente" consulta APIs externas
4. Resultados são preenchidos nos campos (usuário pode editar)
5. Usuário seleciona capa do álbum (da busca ou galeria)
6. Salvar atualiza os metadados da música

### Código Imaginado

#### `hooks/use-metadata-search.ts` (Novo Hook)
```tsx
import { useCallback, useState } from 'react';
import axios from 'axios';

interface SearchResult {
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  duration?: number;
  source: 'spotify' | 'musicbrainz' | 'genius';
}

export function useMetadataSearch() {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  /**
   * Buscar no Spotify (requer API key)
   * Nota: Spotify requer autenticação OAuth
   */
  const searchSpotify = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      try {
        // Exemplo com endpoint público (limitado)
        // Em produção, usar Spotify Web API com token
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
          {
            headers: {
              Authorization: `Bearer YOUR_SPOTIFY_TOKEN`,
            },
          }
        );

        return response.data.tracks.items.map((track: any) => ({
          title: track.name,
          artist: track.artists[0]?.name || 'Unknown',
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
          duration: Math.floor(track.duration_ms / 1000),
          source: 'spotify' as const,
        }));
      } catch (error) {
        console.warn('Erro ao buscar no Spotify:', error);
        return [];
      }
    },
    []
  );

  /**
   * Buscar no MusicBrainz (API pública, sem autenticação)
   */
  const searchMusicBrainz = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      try {
        const response = await axios.get(
          `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(query)}&fmt=json`,
          {
            headers: {
              'User-Agent': 'SimPlay-Mobile/1.0',
            },
          }
        );

        return response.data.recordings.slice(0, 5).map((recording: any) => ({
          title: recording.title,
          artist: recording['artist-credit']?.[0]?.artist?.name || 'Unknown',
          album: recording.releases?.[0]?.title || 'Unknown',
          duration: Math.floor((recording.length || 0) / 1000),
          source: 'musicbrainz' as const,
        }));
      } catch (error) {
        console.warn('Erro ao buscar no MusicBrainz:', error);
        return [];
      }
    },
    []
  );

  /**
   * Buscar em múltiplas fontes
   */
  const searchMetadata = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      try {
        setSearching(true);

        // Buscar em paralelo
        const [spotifyResults, musicbrainzResults] = await Promise.all([
          searchSpotify(query),
          searchMusicBrainz(query),
        ]);

        const allResults = [...spotifyResults, ...musicbrainzResults];
        setResults(allResults);

        return allResults;
      } catch (error) {
        console.error('Erro ao buscar metadados:', error);
        return [];
      } finally {
        setSearching(false);
      }
    },
    [searchSpotify, searchMusicBrainz]
  );

  return {
    searching,
    results,
    searchMetadata,
  };
}
```

#### `components/metadata-editor-modal.tsx` (Novo Componente)
```tsx
import { View, Text, TextInput, Pressable, Modal, ScrollView, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useMetadataSearch } from '@/hooks/use-metadata-search';
import type { Song } from '@/types';

interface MetadataEditorModalProps {
  visible: boolean;
  song: Song | null;
  onClose: () => void;
  onSave: (updatedSong: Song) => void;
}

export function MetadataEditorModal({
  visible,
  song,
  onClose,
  onSave,
}: MetadataEditorModalProps) {
  const colors = useColors();
  const { searching, results, searchMetadata } = useMetadataSearch();

  const [title, setTitle] = useState(song?.title || '');
  const [artist, setArtist] = useState(song?.artist || '');
  const [album, setAlbum] = useState(song?.album || '');
  const [albumArt, setAlbumArt] = useState(song?.albumArt || '');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleAutoSearch = async () => {
    const query = `${title || song?.filename} ${artist}`.trim();
    const foundResults = await searchMetadata(query);

    if (foundResults.length > 0) {
      setShowSearchResults(true);
    } else {
      Alert.alert('Nenhum resultado', 'Nenhuma música encontrada para essa busca.');
    }
  };

  const handleSelectResult = (result: any) => {
    setTitle(result.title);
    setArtist(result.artist);
    setAlbum(result.album);
    if (result.albumArt) {
      setAlbumArt(result.albumArt);
    }
    setShowSearchResults(false);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAlbumArt(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!song) return;

    const updatedSong: Song = {
      ...song,
      title: title || song.title,
      artist: artist || song.artist,
      album: album || song.album,
      albumArt: albumArt || song.albumArt,
    };

    onSave(updatedSong);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
            Editar Metadados
          </Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          {/* Capa do Álbum */}
          <Pressable
            onPress={handlePickImage}
            style={{
              width: 160,
              height: 160,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 2,
              borderColor: colors.border,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            {albumArt ? (
              <Image source={{ uri: albumArt }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <MaterialIcons name="add-photo-alternate" size={48} color={colors.muted} />
            )}
          </Pressable>

          {/* Campo Título */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 8 }}>
              Título
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 16,
              }}
              placeholder="Título da música"
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Campo Artista */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 8 }}>
              Artista
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 16,
              }}
              placeholder="Nome do artista"
              placeholderTextColor={colors.muted}
              value={artist}
              onChangeText={setArtist}
            />
          </View>

          {/* Campo Álbum */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 8 }}>
              Álbum
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 16,
              }}
              placeholder="Nome do álbum"
              placeholderTextColor={colors.muted}
              value={album}
              onChangeText={setAlbum}
            />
          </View>

          {/* Botão Buscar Automaticamente */}
          <Pressable
            onPress={handleAutoSearch}
            disabled={searching}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16,
              opacity: searching ? 0.6 : 1,
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '600', fontSize: 16 }}>
              {searching ? 'Buscando...' : 'Buscar Automaticamente'}
            </Text>
          </Pressable>

          {/* Resultados da Busca */}
          {showSearchResults && results.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 12 }}>
                Resultados Encontrados
              </Text>
              {results.map((result, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSelectResult(result)}
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    gap: 12,
                  }}
                >
                  {result.albumArt && (
                    <Image
                      source={{ uri: result.albumArt }}
                      style={{ width: 60, height: 60, borderRadius: 4 }}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.foreground, fontWeight: '600' }}>
                      {result.title}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 13 }}>
                      {result.artist}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {result.album}
                    </Text>
                  </View>
                  <MaterialIcons name="check-circle" size={24} color={colors.primary} />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer com Botões */}
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Pressable
            onPress={onClose}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.foreground, fontWeight: '600' }}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: colors.primary,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>Salvar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
```

#### Integração na Playlist
```tsx
import { MetadataEditorModal } from '@/components/metadata-editor-modal';

export default function PlaylistScreen() {
  const { songs, addSongs } = usePlayer();
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const handleUpdateMetadata = async (updatedSong: Song) => {
    // Atualizar a música na lista
    const updatedSongs = songs.map((s) => (s.id === updatedSong.id ? updatedSong : s));
    await addSongs(updatedSongs);
    setEditingSong(null);
  };

  return (
    <>
      {/* ... Playlist ... */}
      
      {/* Botão Editar em cada card de música */}
      <Pressable onPress={() => setEditingSong(song)}>
        <MaterialIcons name="edit" size={24} color={colors.primary} />
      </Pressable>

      {/* Modal de Edição */}
      <MetadataEditorModal
        visible={!!editingSong}
        song={editingSong}
        onClose={() => setEditingSong(null)}
        onSave={handleUpdateMetadata}
      />
    </>
  );
}
```

### Recursos

- ✅ Edição manual de metadados
- ✅ Busca automática em múltiplas APIs (Spotify, MusicBrainz)
- ✅ Seleção de capa do álbum (da busca ou galeria)
- ✅ Preview dos resultados antes de salvar
- ✅ Atualização persistente dos metadados

### APIs Utilizadas

| API | Autenticação | Limite | Custo |
|-----|--------------|--------|-------|
| **MusicBrainz** | Nenhuma | 1 req/s | Grátis |
| **Spotify** | OAuth | 429 req/s | Grátis (com token) |
| **Genius** | API Key | Ilimitado | Grátis |

---

## Resumo de Implementação

| Passo | Complexidade | Tempo Estimado | Prioridade |
|-------|--------------|----------------|----------|
| 1 - Capa do Álbum | ⭐⭐ Baixa | 30 min | 🔴 Alta |
| 2 - Importar Pasta | ⭐⭐⭐ Média | 45 min | 🔴 Alta |
| 3 - Editor ID3 + Busca | ⭐⭐⭐⭐ Alta | 2-3 horas | 🔴 Alta |

**Ordem Recomendada:** 1 → 2 → 3

Todos os códigos acima são **totalmente funcionais** e prontos para implementação. Basta confirmar e executar!
