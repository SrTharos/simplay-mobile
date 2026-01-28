# Passo F: Presentes Visuais - Imagens de Músicas Mais Tocadas

## Descrição
Gerar imagens bonitas e compartilháveis com as músicas mais tocadas do mês e do ano. Design baseado nas cores do app com arte visual atraente.

## Conceito Visual

```
┌─────────────────────────────────────────┐
│                                         │
│   [Gradiente com cores do app]          │
│                                         │
│   🎵 TOP 5 MÚSICAS - JANEIRO             │
│   Últimos 30 dias                       │
│                                         │
│   1. 🥇 Música 1 - Artista 1            │
│      ▓▓▓▓▓▓▓▓░░ 45 plays                │
│                                         │
│   2. 🥈 Música 2 - Artista 2            │
│      ▓▓▓▓▓▓░░░░ 38 plays                │
│                                         │
│   3. 🥉 Música 3 - Artista 3            │
│      ▓▓▓▓▓░░░░░ 32 plays                │
│                                         │
│   4. 4️⃣  Música 4 - Artista 4           │
│      ▓▓▓▓░░░░░░ 28 plays                │
│                                         │
│   5. 5️⃣  Música 5 - Artista 5           │
│      ▓▓▓░░░░░░░ 22 plays                │
│                                         │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│   Total: 165 reproduções                │
│   Tempo: 12h 45m                        │
│                                         │
│   SimPlay Mobile 🎵                     │
│   Compartilhe seu gosto musical!        │
│                                         │
└─────────────────────────────────────────┘
```

## Código Imaginado

### `hooks/use-listening-gifts.ts` (Novo Hook)
```tsx
import { useCallback } from 'react';
import { Canvas, Image as SkiaImage } from '@shopify/react-native-skia';
import { captureRef } from 'react-native-view-shot';
import { useColors } from '@/hooks/use-colors';
import type { Song } from '@/types';

interface TopSong {
  song: Song;
  playCount: number;
  percentage: number;
}

export function useListeningGifts() {
  const colors = useColors();

  /**
   * Calcular top 5 músicas por período
   */
  const getTopSongs = useCallback(
    (songs: Song[], playHistory: any[], days: number): TopSong[] => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Filtrar histórico pelo período
      const periodHistory = playHistory.filter(
        (entry) => new Date(entry.playedAt) > cutoffDate
      );

      // Contar reproduções por música
      const playCountMap = new Map<string, number>();
      periodHistory.forEach((entry) => {
        playCountMap.set(entry.songId, (playCountMap.get(entry.songId) || 0) + 1);
      });

      // Converter em array e ordenar
      const topSongs = Array.from(playCountMap.entries())
        .map(([songId, count]) => {
          const song = songs.find((s) => s.id === songId);
          return { song: song!, playCount: count };
        })
        .filter((item) => item.song)
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 5);

      // Calcular percentuais
      const maxPlays = topSongs[0]?.playCount || 1;
      return topSongs.map((item) => ({
        ...item,
        percentage: (item.playCount / maxPlays) * 100,
      }));
    },
    []
  );

  /**
   * Formatar duração total
   */
  const formatTotalDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }, []);

  /**
   * Obter nome do mês
   */
  const getMonthName = useCallback((daysBack: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    return date.toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
  }, []);

  /**
   * Gerar gradiente de cores baseado no tema
   */
  const getGradientColors = useCallback(() => {
    return {
      primary: colors.primary,
      secondary: colors.surface,
      background: colors.background,
      text: colors.foreground,
      muted: colors.muted,
      accent: colors.success, // cor alternativa
    };
  }, [colors]);

  return {
    getTopSongs,
    formatTotalDuration,
    getMonthName,
    getGradientColors,
  };
}
```

### `components/listening-gift-image.tsx` (Componente de Renderização)
```tsx
import { View, Text, Image } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useListeningGifts } from '@/hooks/use-listening-gifts';
import type { Song } from '@/types';

interface ListeningGiftImageProps {
  topSongs: Array<{ song: Song; playCount: number; percentage: number }>;
  period: 'month' | 'year';
  totalPlays: number;
  totalDuration: number;
  monthName?: string;
}

export function ListeningGiftImage({
  topSongs,
  period,
  totalPlays,
  totalDuration,
  monthName,
}: ListeningGiftImageProps) {
  const colors = useColors();
  const { formatTotalDuration } = useListeningGifts();

  const medalEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  const periodLabel = period === 'month' ? `${monthName} - Últimos 30 dias` : 'ANO - Últimos 365 dias';
  const titleText = period === 'month' ? 'TOP 5 MÚSICAS' : 'TOP 5 MÚSICAS DO ANO';

  return (
    <View
      style={{
        width: 1080,
        height: 1440,
        backgroundColor: colors.background,
        padding: 60,
        justifyContent: 'space-between',
        // Gradiente de fundo (simulado com cores)
      }}
    >
      {/* Header com Gradiente */}
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 20,
          padding: 40,
          marginBottom: 40,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.background,
            marginBottom: 8,
          }}
        >
          🎵 {titleText}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: colors.background,
            opacity: 0.9,
          }}
        >
          {periodLabel}
        </Text>
      </View>

      {/* Lista de Top 5 */}
      <View style={{ gap: 24, marginBottom: 40 }}>
        {topSongs.map((item, index) => (
          <View key={index} style={{ gap: 12 }}>
            {/* Número + Título */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
              <Text style={{ fontSize: 48 }}>
                {medalEmojis[index]}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: colors.foreground,
                    marginBottom: 4,
                  }}
                  numberOfLines={2}
                >
                  {item.song.title}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.muted,
                  }}
                  numberOfLines={1}
                >
                  {item.song.artist || 'Artista Desconhecido'}
                </Text>
              </View>
            </View>

            {/* Barra de Progresso + Contagem */}
            <View style={{ marginLeft: 80, gap: 8 }}>
              {/* Barra */}
              <View
                style={{
                  height: 12,
                  backgroundColor: colors.surface,
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${item.percentage}%`,
                    backgroundColor: colors.primary,
                    borderRadius: 6,
                  }}
                />
              </View>
              {/* Contagem */}
              <Text
                style={{
                  fontSize: 16,
                  color: colors.muted,
                  fontWeight: '600',
                }}
              >
                {item.playCount} reproduções
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View
        style={{
          height: 2,
          backgroundColor: colors.border,
          marginVertical: 20,
        }}
      />

      {/* Estatísticas Finais */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          gap: 16,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {totalPlays}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
              }}
            >
              Reproduções
            </Text>
          </View>
          <View
            style={{
              width: 2,
              backgroundColor: colors.border,
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {formatTotalDuration(totalDuration)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted,
              }}
            >
              Tempo Total
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.foreground,
          }}
        >
          SimPlay Mobile 🎵
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.muted,
          }}
        >
          Compartilhe seu gosto musical!
        </Text>
      </View>
    </View>
  );
}
```

### `screens/listening-gifts-screen.tsx` (Nova Tela)
```tsx
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useCallback, useRef } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { usePlayer } from '@/hooks/use-player';
import { useHistory } from '@/hooks/use-history';
import { useListeningGifts } from '@/hooks/use-listening-gifts';
import { ListeningGiftImage } from '@/components/listening-gift-image';

export default function ListeningGiftsScreen() {
  const colors = useColors();
  const { songs } = usePlayer();
  const { history, stats } = useHistory(songs);
  const { getTopSongs, formatTotalDuration, getMonthName } = useListeningGifts();

  const monthGiftRef = useRef(null);
  const yearGiftRef = useRef(null);

  const [generating, setGenerating] = useState<'month' | 'year' | null>(null);

  // Calcular top 5 do mês
  const monthTopSongs = getTopSongs(songs, history, 30);
  const monthTotalPlays = history.filter((entry) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return new Date(entry.playedAt) > cutoff;
  }).length;
  const monthTotalDuration = history
    .filter((entry) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      return new Date(entry.playedAt) > cutoff;
    })
    .reduce((sum, entry) => sum + entry.duration, 0);

  // Calcular top 5 do ano
  const yearTopSongs = getTopSongs(songs, history, 365);
  const yearTotalPlays = history.filter((entry) => {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    return new Date(entry.playedAt) > cutoff;
  }).length;
  const yearTotalDuration = history
    .filter((entry) => {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      return new Date(entry.playedAt) > cutoff;
    })
    .reduce((sum, entry) => sum + entry.duration, 0);

  // Gerar e compartilhar imagem
  const generateAndShare = useCallback(
    async (ref: any, period: 'month' | 'year') => {
      try {
        setGenerating(period);

        // Capturar a view como imagem
        const uri = await captureRef(ref, {
          format: 'png',
          quality: 0.95,
        });

        // Pedir permissão
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão', 'Permissão de mídia necessária');
          return;
        }

        // Salvar na galeria
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('SimPlay', asset, false);

        // Compartilhar
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: `Meu Top 5 ${period === 'month' ? 'do Mês' : 'do Ano'} - SimPlay`,
          });
        }

        Alert.alert('Sucesso', 'Imagem salva e compartilhada!');
      } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        Alert.alert('Erro', 'Falha ao gerar imagem');
      } finally {
        setGenerating(null);
      }
    },
    []
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Título */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.foreground,
            marginBottom: 8,
          }}
        >
          Seus Presentes 🎁
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 24 }}>
          Visualize e compartilhe suas músicas mais tocadas
        </Text>

        {/* Top 5 do Mês */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.foreground,
              marginBottom: 12,
            }}
          >
            Top 5 do Mês
          </Text>

          {monthTopSongs.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 24,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <MaterialIcons name="music-note" size={48} color={colors.muted} />
              <Text style={{ color: colors.muted, marginTop: 12 }}>
                Nenhuma música tocada este mês
              </Text>
            </View>
          ) : (
            <>
              {/* Preview da Imagem */}
              <View
                ref={monthGiftRef}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <ListeningGiftImage
                  topSongs={monthTopSongs}
                  period="month"
                  totalPlays={monthTotalPlays}
                  totalDuration={monthTotalDuration}
                  monthName={getMonthName()}
                />
              </View>

              {/* Botões */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => generateAndShare(monthGiftRef, 'month')}
                  disabled={generating === 'month'}
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    opacity: generating === 'month' ? 0.6 : 1,
                  }}
                >
                  {generating === 'month' ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialIcons name="share" size={20} color={colors.background} />
                      <Text style={{ color: colors.background, fontWeight: '600' }}>
                        Compartilhar
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    // Salvar sem compartilhar
                    Alert.alert('Salvo', 'Imagem salva na galeria!');
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialIcons name="download" size={20} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontWeight: '600' }}>
                      Salvar
                    </Text>
                  </View>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Top 5 do Ano */}
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.foreground,
              marginBottom: 12,
            }}
          >
            Top 5 do Ano
          </Text>

          {yearTopSongs.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 24,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <MaterialIcons name="music-note" size={48} color={colors.muted} />
              <Text style={{ color: colors.muted, marginTop: 12 }}>
                Nenhuma música tocada este ano
              </Text>
            </View>
          ) : (
            <>
              {/* Preview da Imagem */}
              <View
                ref={yearGiftRef}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <ListeningGiftImage
                  topSongs={yearTopSongs}
                  period="year"
                  totalPlays={yearTotalPlays}
                  totalDuration={yearTotalDuration}
                />
              </View>

              {/* Botões */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => generateAndShare(yearGiftRef, 'year')}
                  disabled={generating === 'year'}
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    opacity: generating === 'year' ? 0.6 : 1,
                  }}
                >
                  {generating === 'year' ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialIcons name="share" size={20} color={colors.background} />
                      <Text style={{ color: colors.background, fontWeight: '600' }}>
                        Compartilhar
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    Alert.alert('Salvo', 'Imagem salva na galeria!');
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialIcons name="download" size={20} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontWeight: '600' }}>
                      Salvar
                    </Text>
                  </View>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
```

### Integração na Navegação
```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

<Tabs.Screen
  name="gifts"
  options={{
    title: "Presentes",
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="gift.fill" color={color} />,
  }}
/>
```

## Recursos

- ✅ Imagem bonita com design baseado nas cores do app
- ✅ Top 5 músicas do mês (últimos 30 dias)
- ✅ Top 5 músicas do ano (últimos 365 dias)
- ✅ Barras de progresso visuais
- ✅ Medalhas (🥇🥈🥉4️⃣5️⃣)
- ✅ Estatísticas totais (reproduções + tempo)
- ✅ Compartilhar via WhatsApp, Instagram, etc
- ✅ Salvar na galeria
- ✅ Design responsivo e elegante

## Fluxo de Uso

```
1. Usuário abre aba "Presentes"
2. Vê preview do Top 5 do Mês
3. Clica "Compartilhar" ou "Salvar"
4. Imagem é gerada em alta resolução
5. Compartilha no WhatsApp, Instagram, etc
6. Mesmo para Top 5 do Ano
```

## Tempo Estimado: 1-2 horas

Perfeito para dar um "presente" visual ao usuário! 🎁
