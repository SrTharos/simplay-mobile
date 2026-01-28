# Passo E: Sistema de Sincronização de Letras (Lyrics Sync) - FLUXO OTIMIZADO

## Descrição
Editor de 2 páginas para sincronizar letras com timestamps de forma prática e intuitiva:
- **Página 1:** Colar letra completa (ou já vem preenchida se existir)
- **Página 2:** Sincronizar linha por linha com botão de clock + botão de voltar ao tempo marcado

## Fluxo de Uso (Otimizado)

```
1. Usuário toca música com ou SEM letra
2. Botão "Editar Letras" abre editor (Página 1)
3. Cola a letra completa (ou já vem preenchida se existir)
4. Clica "Modo Sync" → Abre Página 2
5. Cada linha em caixa de texto com botão de clock lateral
6. Usuário:
   - Clica Play
   - Clica no botão clock quando a linha começa
   - Marca o tempo atual do áudio
7. Botão "Voltar ao Tempo" permite revisar/preparar para próxima linha
8. Salva sincronização
9. Na reprodução:
   - 2 linhas anteriores em fadeout
   - Linha atual em DESTAQUE
   - Próximas 3 em cascata
   - Animação suave
```

## Código Imaginado

### `types/index.ts` - Novo Tipo
```tsx
export interface LyricLine {
  text: string;
  startTime: number; // segundos
  endTime?: number; // opcional
}

export interface SongLyrics {
  songId: string;
  lyrics: string; // texto completo
  syncedLyrics: LyricLine[]; // com timestamps
  isSynced: boolean;
}
```

### `hooks/use-lyrics-sync.ts` (Novo Hook)
```tsx
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SongLyrics, LyricLine } from '@/types';

export function useLyricsSync() {
  const [allLyrics, setAllLyrics] = useState<Map<string, SongLyrics>>(new Map());

  // Carregar letras
  const loadLyrics = useCallback(async (songId: string) => {
    try {
      const saved = await AsyncStorage.getItem(`lyrics_${songId}`);
      if (saved) {
        return JSON.parse(saved) as SongLyrics;
      }
    } catch (error) {
      console.error('Erro ao carregar letras:', error);
    }
    return null;
  }, []);

  // Salvar letras
  const saveLyrics = useCallback(
    async (songId: string, lyrics: SongLyrics) => {
      try {
        await AsyncStorage.setItem(`lyrics_${songId}`, JSON.stringify(lyrics));
        setAllLyrics((prev) => new Map(prev).set(songId, lyrics));
      } catch (error) {
        console.error('Erro ao salvar letras:', error);
      }
    },
    []
  );

  // Obter linha atual baseado no tempo
  const getCurrentLine = useCallback(
    (lyrics: LyricLine[], currentTime: number) => {
      return lyrics.find(
        (line) => currentTime >= line.startTime && (!line.endTime || currentTime < line.endTime)
      );
    },
    []
  );

  // Obter linhas anteriores (para fadeout)
  const getPreviousLines = useCallback(
    (lyrics: LyricLine[], currentTime: number, count: number = 2) => {
      const currentIndex = lyrics.findIndex(
        (line) => currentTime >= line.startTime && (!line.endTime || currentTime < line.endTime)
      );

      if (currentIndex <= 0) return [];
      return lyrics.slice(Math.max(0, currentIndex - count), currentIndex);
    },
    []
  );

  // Obter próximas linhas (para cascata)
  const getUpcomingLines = useCallback(
    (lyrics: LyricLine[], currentTime: number, count: number = 3) => {
      const currentIndex = lyrics.findIndex(
        (line) => currentTime >= line.startTime && (!line.endTime || currentTime < line.endTime)
      );

      if (currentIndex === -1) return [];
      return lyrics.slice(currentIndex + 1, currentIndex + 1 + count);
    },
    []
  );

  return {
    allLyrics,
    loadLyrics,
    saveLyrics,
    getCurrentLine,
    getPreviousLines,
    getUpcomingLines,
  };
}
```

### `screens/lyrics-editor-page1.tsx` - Página 1 (Colar Letra)
```tsx
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import type { Song } from '@/types';

interface LyricsEditorPage1Props {
  song: Song;
  initialLyrics?: string;
  onNext: (lyrics: string) => void;
  onCancel: () => void;
}

export function LyricsEditorPage1({
  song,
  initialLyrics = '',
  onNext,
  onCancel,
}: LyricsEditorPage1Props) {
  const colors = useColors();
  const [fullText, setFullText] = useState(initialLyrics);

  const handleNext = () => {
    if (!fullText.trim()) {
      Alert.alert('Aviso', 'Cole a letra antes de continuar');
      return;
    }
    onNext(fullText);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            Editar Letras
          </Text>
          <Text style={{ color: colors.muted }}>
            {song.title} - {song.artist}
          </Text>
        </View>

        {/* Instruções */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <MaterialIcons name="info" size={20} color={colors.primary} />
            <Text style={{ color: colors.foreground, flex: 1, fontSize: 13 }}>
              Cole a letra completa. Uma linha por vez. Depois sincronize os tempos.
            </Text>
          </View>
        </View>

        {/* Campo de Texto */}
        <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 8 }}>
          Letra:
        </Text>
        <TextInput
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            color: colors.foreground,
            minHeight: 300,
            textAlignVertical: 'top',
            marginBottom: 20,
            fontSize: 14,
          }}
          placeholder="Cole a letra aqui..."
          placeholderTextColor={colors.muted}
          value={fullText}
          onChangeText={setFullText}
          multiline
        />

        {/* Contador de Linhas */}
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 20 }}>
          {fullText.split('\n').filter((line) => line.trim()).length} linhas
        </Text>

        {/* Botões */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={onCancel}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.foreground, fontWeight: '600' }}>
              Cancelar
            </Text>
          </Pressable>
          <Pressable
            onPress={handleNext}
            disabled={!fullText.trim()}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 8,
              backgroundColor: colors.primary,
              alignItems: 'center',
              opacity: !fullText.trim() ? 0.5 : 1,
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>
              Sincronizar Tempos
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
```

### `screens/lyrics-editor-page2.tsx` - Página 2 (Sincronizar Tempos)
```tsx
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useCallback, useRef } from 'react';
import type { Song, LyricLine } from '@/types';

interface LyricsEditorPage2Props {
  song: Song;
  lyrics: string;
  currentTime: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onSave: (syncedLyrics: LyricLine[]) => void;
  onBack: () => void;
}

export function LyricsEditorPage2({
  song,
  lyrics,
  currentTime,
  isPlaying,
  onSeek,
  onSave,
  onBack,
}: LyricsEditorPage2Props) {
  const colors = useColors();
  const lines = lyrics.split('\n').filter((line) => line.trim());
  const [syncedLines, setSyncedLines] = useState<LyricLine[]>(
    lines.map((text, index) => ({
      text,
      startTime: index * 3, // 3 segundos por padrão
    }))
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}.${ms < 10 ? '0' : ''}${ms}`;
  };

  // Marcar tempo atual para a linha
  const markTime = useCallback((index: number) => {
    setSyncedLines((prev) => {
      const updated = [...prev];
      updated[index].startTime = currentTime;
      return updated;
    });
    setEditingIndex(null);
  }, [currentTime]);

  // Voltar ao tempo marcado (para revisar/preparar)
  const goToMarkedTime = useCallback((index: number) => {
    onSeek(syncedLines[index].startTime);
  }, [syncedLines, onSeek]);

  // Salvar sincronização
  const handleSave = () => {
    // Validar que todos os tempos estão em ordem crescente
    for (let i = 1; i < syncedLines.length; i++) {
      if (syncedLines[i].startTime < syncedLines[i - 1].startTime) {
        Alert.alert(
          'Erro',
          'Os tempos devem estar em ordem crescente. Revise a linha ' + (i + 1)
        );
        return;
      }
    }

    onSave(syncedLines);
    Alert.alert('Sucesso', 'Letras sincronizadas com sucesso!');
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            Sincronizar Tempos
          </Text>
          <Text style={{ color: colors.muted }}>
            {syncedLines.length} linhas
          </Text>
        </View>

        {/* Instruções */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <MaterialIcons name="play-arrow" size={18} color={colors.primary} />
              <Text style={{ color: colors.foreground, flex: 1, fontSize: 12 }}>
                Clique em Play e depois no ⏱️ quando a linha começar
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <MaterialIcons name="replay" size={18} color={colors.primary} />
              <Text style={{ color: colors.foreground, flex: 1, fontSize: 12 }}>
                Clique em ↩️ para voltar ao tempo marcado e revisar
              </Text>
            </View>
          </View>
        </View>

        {/* Tempo Atual */}
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.background, fontSize: 12, opacity: 0.8 }}>
            Tempo Atual
          </Text>
          <Text
            style={{
              color: colors.background,
              fontSize: 28,
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}
          >
            {formatTime(currentTime)}
          </Text>
        </View>

        {/* Lista de Linhas */}
        <FlatList
          data={syncedLines}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                marginBottom: 12,
                borderWidth: 1,
                borderColor:
                  editingIndex === index ? colors.primary : colors.border,
                overflow: 'hidden',
              }}
            >
              {/* Número da Linha */}
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.background,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  Linha {index + 1} de {syncedLines.length}
                </Text>
              </View>

              {/* Conteúdo */}
              <View style={{ padding: 12, gap: 12 }}>
                {/* Texto da Linha */}
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 16,
                    fontWeight: '500',
                    lineHeight: 22,
                  }}
                >
                  {item.text}
                </Text>

                {/* Tempo Marcado */}
                <View
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }}
                  >
                    {formatTime(item.startTime)}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>
                    {editingIndex === index ? 'Selecionada' : ''}
                  </Text>
                </View>

                {/* Botões de Ação */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {/* Botão Marcar Tempo */}
                  <Pressable
                    onPress={() => markTime(index)}
                    style={{
                      flex: 1,
                      backgroundColor: isPlaying ? colors.primary : colors.border,
                      borderRadius: 6,
                      paddingVertical: 10,
                      alignItems: 'center',
                      opacity: isPlaying ? 1 : 0.5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <MaterialIcons
                        name="schedule"
                        size={16}
                        color={isPlaying ? colors.background : colors.foreground}
                      />
                      <Text
                        style={{
                          color: isPlaying ? colors.background : colors.foreground,
                          fontWeight: '600',
                          fontSize: 12,
                        }}
                      >
                        Marcar
                      </Text>
                    </View>
                  </Pressable>

                  {/* Botão Voltar ao Tempo */}
                  <Pressable
                    onPress={() => goToMarkedTime(index)}
                    style={{
                      flex: 1,
                      backgroundColor: colors.surface,
                      borderRadius: 6,
                      paddingVertical: 10,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <MaterialIcons
                        name="replay"
                        size={16}
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          color: colors.primary,
                          fontWeight: '600',
                          fontSize: 12,
                        }}
                      >
                        Voltar
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />

        {/* Botões de Rodapé */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
          <Pressable
            onPress={onBack}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.foreground, fontWeight: '600' }}>
              Voltar
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 8,
              backgroundColor: colors.primary,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>
              Salvar Sincronização
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
```

### `components/lyrics-display.tsx` - Visualização Animada
```tsx
import { View, Text, Animated } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useEffect, useRef, useMemo } from 'react';
import type { LyricLine } from '@/types';
import { useLyricsSync } from '@/hooks/use-lyrics-sync';

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
}

export function LyricsDisplay({
  lyrics,
  currentTime,
  isPlaying,
}: LyricsDisplayProps) {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { getCurrentLine, getPreviousLines, getUpcomingLines } = useLyricsSync();

  // Obter linhas para exibir
  const currentLine = useMemo(
    () => getCurrentLine(lyrics, currentTime),
    [lyrics, currentTime, getCurrentLine]
  );

  const previousLines = useMemo(
    () => getPreviousLines(lyrics, currentTime, 2),
    [lyrics, currentTime, getPreviousLines]
  );

  const upcomingLines = useMemo(
    () => getUpcomingLines(lyrics, currentTime, 3),
    [lyrics, currentTime, getUpcomingLines]
  );

  // Animar entrada de texto
  useEffect(() => {
    if (currentLine) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentLine, fadeAnim]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 16,
      }}
    >
      {/* Linhas Anteriores - Fadeout */}
      {previousLines.length > 0 && (
        <View style={{ gap: 6, opacity: 0.3 }}>
          {previousLines.map((line, index) => (
            <Text
              key={index}
              style={{
                fontSize: 12,
                color: colors.muted,
                textAlign: 'center',
                lineHeight: 16,
              }}
            >
              {line.text}
            </Text>
          ))}
        </View>
      )}

      {/* Linha Atual - Destaque */}
      {currentLine && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: 'bold',
              color: colors.primary,
              textAlign: 'center',
              lineHeight: 34,
            }}
          >
            {currentLine.text}
          </Text>
        </Animated.View>
      )}

      {/* Próximas Linhas - Cascata */}
      {upcomingLines.length > 0 && (
        <View style={{ gap: 8, marginTop: 16 }}>
          {upcomingLines.map((line, index) => (
            <Text
              key={index}
              style={{
                fontSize: 14 - index * 2,
                color: colors.muted,
                opacity: 0.6 - index * 0.15,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              {line.text}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
```

## Fluxo Completo Resumido

```
PÁGINA 1 (Editar Letra):
├─ Cole a letra completa
├─ Veja o contador de linhas
└─ Clique "Sincronizar Tempos"

PÁGINA 2 (Sincronizar):
├─ Para cada linha:
│  ├─ Clique Play
│  ├─ Quando a linha começa, clique ⏱️ "Marcar"
│  ├─ Se errou, clique ↩️ "Voltar" para revisar
│  └─ Próxima linha
├─ Validação automática de ordem
└─ Clique "Salvar Sincronização"

REPRODUÇÃO:
├─ 2 linhas anteriores (fadeout)
├─ Linha atual (DESTAQUE - grande, cor primária)
├─ Próximas 3 linhas (cascata com fade)
└─ Animação suave de transição
```

## Recursos

- ✅ Editor de 2 páginas (simples e intuitivo)
- ✅ Marcar tempo com botão de clock
- ✅ Botão "Voltar ao Tempo" para revisar/preparar
- ✅ Validação de ordem crescente
- ✅ Visualização animada com cascata
- ✅ 2 linhas anteriores em fadeout
- ✅ Linha atual em DESTAQUE
- ✅ Próximas 3 linhas em cascata
- ✅ Armazenamento persistente
- ✅ Suporte a ID3 tag LYRICS

## Tempo Estimado: 2-3 horas

Muito mais prático e usável que o fluxo anterior! 🎵
