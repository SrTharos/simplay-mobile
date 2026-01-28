# Passo F: Estatísticas Simples - Top 5 do Mês e Top 10 do Ano

## Descrição
Tela simples mostrando as músicas mais tocadas do mês e do ano. Sem geração de imagens (deixar para versão com skins). Foco em funcionalidade limpa e sem código oculto.

## Fluxo

```
1. Usuário abre aba "Estatísticas"
2. Vê Top 5 do Mês (últimos 30 dias)
3. Vê Top 10 do Ano (últimos 365 dias)
4. Cada item mostra: posição, música, artista, contagem
5. Simples, rápido, sem overhead
```

## Código Imaginado

### `screens/listening-stats-screen.tsx` (Nova Tela)
```tsx
import {
  View,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { usePlayer } from '@/hooks/use-player';
import { useHistory } from '@/hooks/use-history';
import type { Song } from '@/types';

interface TopSongItem {
  song: Song;
  playCount: number;
}

export default function ListeningStatsScreen() {
  const colors = useColors();
  const { songs } = usePlayer();
  const { history } = useHistory(songs);

  // Calcular Top 5 do Mês
  const monthTopSongs = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const monthHistory = history.filter(
      (entry) => new Date(entry.playedAt) > cutoffDate
    );

    const playCountMap = new Map<string, number>();
    monthHistory.forEach((entry) => {
      playCountMap.set(entry.songId, (playCountMap.get(entry.songId) || 0) + 1);
    });

    return Array.from(playCountMap.entries())
      .map(([songId, count]) => ({
        song: songs.find((s) => s.id === songId)!,
        playCount: count,
      }))
      .filter((item) => item.song)
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 5);
  }, [history, songs]);

  // Calcular Top 10 do Ano
  const yearTopSongs = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

    const yearHistory = history.filter(
      (entry) => new Date(entry.playedAt) > cutoffDate
    );

    const playCountMap = new Map<string, number>();
    yearHistory.forEach((entry) => {
      playCountMap.set(entry.songId, (playCountMap.get(entry.songId) || 0) + 1);
    });

    return Array.from(playCountMap.entries())
      .map(([songId, count]) => ({
        song: songs.find((s) => s.id === songId)!,
        playCount: count,
      }))
      .filter((item) => item.song)
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 10);
  }, [history, songs]);

  const medalEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  const renderTopSongItem = (
    item: TopSongItem,
    index: number,
    isMedal: boolean
  ) => (
    <View
      key={index}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Posição */}
      <Text
        style={{
          fontSize: isMedal ? 24 : 20,
          marginRight: 12,
          minWidth: 32,
        }}
      >
        {isMedal ? medalEmojis[index] : numberEmojis[index]}
      </Text>

      {/* Informações da Música */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.foreground,
            fontWeight: '600',
            fontSize: 14,
            marginBottom: 2,
          }}
          numberOfLines={1}
        >
          {item.song.title}
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
          }}
          numberOfLines={1}
        >
          {item.song.artist || 'Artista Desconhecido'}
        </Text>
      </View>

      {/* Contagem */}
      <View
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
          marginLeft: 12,
        }}
      >
        <Text
          style={{
            color: colors.background,
            fontWeight: '600',
            fontSize: 12,
          }}
        >
          {item.playCount}x
        </Text>
      </View>
    </View>
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
          Suas Estatísticas
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 24 }}>
          Acompanhe suas músicas favoritas
        </Text>

        {/* Top 5 do Mês */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
              gap: 8,
            }}
          >
            <MaterialIcons name="calendar-month" size={20} color={colors.primary} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.foreground,
              }}
            >
              Top 5 do Mês
            </Text>
          </View>

          {monthTopSongs.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <MaterialIcons name="music-note" size={40} color={colors.muted} />
              <Text
                style={{
                  color: colors.muted,
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                Nenhuma música tocada este mês
              </Text>
            </View>
          ) : (
            <View>
              {monthTopSongs.map((item, index) =>
                renderTopSongItem(item, index, true)
              )}
            </View>
          )}
        </View>

        {/* Top 10 do Ano */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
              gap: 8,
            }}
          >
            <MaterialIcons name="calendar-year" size={20} color={colors.primary} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.foreground,
              }}
            >
              Top 10 do Ano
            </Text>
          </View>

          {yearTopSongs.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <MaterialIcons name="music-note" size={40} color={colors.muted} />
              <Text
                style={{
                  color: colors.muted,
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                Nenhuma música tocada este ano
              </Text>
            </View>
          ) : (
            <View>
              {yearTopSongs.map((item, index) =>
                renderTopSongItem(item, index, false)
              )}
            </View>
          )}
        </View>

        {/* Rodapé com Logo */}
        <View
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.foreground,
            }}
          >
            SimPlay Mobile 🎵
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
              textAlign: 'center',
            }}
          >
            Simple Player Offline
          </Text>
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
import { IconSymbol } from '@/components/ui/icon-symbol';

<Tabs.Screen
  name="stats"
  options={{
    title: "Estatísticas",
    tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="chart.bar.fill" color={color} />
    ),
  }}
/>
```

### Criar arquivo da tela
```bash
# Criar o arquivo da tela
touch app/(tabs)/stats.tsx
```

## Garantias de Limpeza - Checklist

### ✅ Sem Propagandas
- [ ] Nenhuma biblioteca de ads (Google Ads, Facebook Ads, etc)
- [ ] Nenhum código de analytics que rastreia usuário
- [ ] Nenhuma chamada a servidores de publicidade

### ✅ Sem Código Oculto
- [ ] Nenhum background service rodando
- [ ] Nenhuma tarefa agendada em background
- [ ] Nenhum listener de eventos desnecessário
- [ ] Nenhuma sincronização automática com servidor

### ✅ Sem Consumo de Bateria
- [ ] Usar `useKeepAwake()` apenas quando necessário (durante reprodução)
- [ ] Desabilitar `useKeepAwake()` quando pausa
- [ ] Nenhum polling de dados em background
- [ ] Nenhuma animação contínua quando app está minimizado
- [ ] Nenhum GPS ou localização
- [ ] Nenhum Bluetooth desnecessário

### ✅ Código Limpo
```tsx
// ✅ BOM - Apenas quando tocando
import { useKeepAwake } from 'expo-keep-awake';

export function Player() {
  const { isPlaying } = usePlayer();

  useEffect(() => {
    if (isPlaying) {
      useKeepAwake(); // Ativa apenas durante reprodução
    }
    return () => {
      // Desativa quando pausa
    };
  }, [isPlaying]);
}

// ❌ RUIM - Sempre ativo
useKeepAwake(); // Sem condição
```

### ✅ Verificação de Dependências
```bash
# Verificar package.json - Nenhuma dessas deve estar presente:
# - firebase (analytics)
# - react-native-google-analytics
# - mixpanel
# - amplitude
# - appsflyer
# - adjust
# - branch
# - facebook-app-events
# - react-native-admob
# - react-native-google-mobile-ads
```

### ✅ Verificação de Código
```tsx
// Procurar por:
// ❌ setInterval (sem limpeza)
// ❌ setTimeout (sem limpeza)
// ❌ addEventListener (sem removeEventListener)
// ❌ fetch/axios para analytics
// ❌ console.log em produção (pode impactar performance)
// ❌ Large objects em estado global
```

## Recursos

- ✅ Top 5 do Mês (últimos 30 dias)
- ✅ Top 10 do Ano (últimos 365 dias)
- ✅ Interface simples e rápida
- ✅ Logo do app para marketing orgânico
- ✅ 100% sem propagandas
- ✅ 100% sem código oculto
- ✅ 100% sem consumo de bateria em background
- ✅ Código limpo e auditável

## Tempo Estimado: 30-45 minutos

Simples, funcional e limpo! 🎵
