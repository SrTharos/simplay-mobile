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
            <MaterialIcons name="event" size={20} color={colors.primary} />
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
