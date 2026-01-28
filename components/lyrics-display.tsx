import { View, Text, ScrollView } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { SyncedLyric } from '@/hooks/use-lyrics-sync';

interface LyricsDisplayProps {
  previous: SyncedLyric[];
  current: SyncedLyric | null;
  next: SyncedLyric[];
}

/**
 * Componente para exibir letras sincronizadas com animação em cascata
 */
export function LyricsDisplay({ previous, current, next }: LyricsDisplayProps) {
  const colors = useColors();

  if (!current && previous.length === 0 && next.length === 0) {
    return (
      <View
        style={{
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          marginVertical: 16,
        }}
      >
        <Text style={{ color: colors.muted, fontSize: 14, fontWeight: '500' }}>
          Nenhuma letra sincronizada
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginVertical: 16,
        minHeight: 200,
        justifyContent: 'center',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {/* Linhas Anteriores em Fadeout */}
        {previous.map((lyric, index) => {
          const opacity = 0.3 + (index / previous.length) * 0.4; // Fade progressivo
          return (
            <Text
              key={`prev-${index}`}
              style={{
                color: colors.foreground,
                fontSize: 14,
                opacity,
                fontWeight: '400',
              }}
              numberOfLines={2}
            >
              {lyric.text}
            </Text>
          );
        })}

        {/* Linha Atual em Destaque */}
        {current && (
          <View
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 8,
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                color: colors.background,
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              numberOfLines={3}
            >
              {current.text}
            </Text>
          </View>
        )}

        {/* Próximas Linhas em Cascata */}
        {next.map((lyric, index) => {
          const opacity = 1 - (index / next.length) * 0.6; // Fade progressivo
          const fontSize = 16 - index * 1;
          return (
            <Text
              key={`next-${index}`}
              style={{
                color: colors.foreground,
                fontSize,
                opacity,
                fontWeight: index === 0 ? '500' : '400',
              }}
              numberOfLines={2}
            >
              {lyric.text}
            </Text>
          );
        })}
      </ScrollView>
    </View>
  );
}
