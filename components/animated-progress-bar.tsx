import { View, Pressable, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useMemo } from 'react';

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  currentTime: number;
  duration: number;
  onSeek: (percent: number) => void;
}

/**
 * Barra de progresso com visualizador de áudio (50 barras animadas)
 */
export function AnimatedProgressBar({
  progress,
  currentTime,
  duration,
  onSeek,
}: AnimatedProgressBarProps) {
  const colors = useColors();

  // Gerar alturas aleatórias para as barras (baseado na posição)
  const barHeights = useMemo(() => {
    const heights: number[] = [];
    for (let i = 0; i < 50; i++) {
      // Usar seed baseado no índice para consistência
      const seed = (i * 12345) % 100;
      const height = 20 + (seed % 30); // 20-50% de altura
      heights.push(height);
    }
    return heights;
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePress = (e: any) => {
    const { locationX, width } = e.nativeEvent;
    const percent = (locationX / width) * 100;
    onSeek(Math.max(0, Math.min(100, percent)));
  };

  return (
    <View style={{ gap: 8, paddingHorizontal: 16 }}>
      {/* Visualizador de Áudio */}
      <Pressable
        onPress={handlePress}
        style={{
          height: 60,
          backgroundColor: colors.surface,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          paddingVertical: 8,
          paddingHorizontal: 4,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {barHeights.map((height, index) => {
          const barProgress = (index / barHeights.length) * 100;
          const isActive = barProgress <= progress;

          return (
            <View
              key={index}
              style={{
                width: '2%',
                height: `${height}%`,
                backgroundColor: isActive ? colors.primary : colors.muted,
                borderRadius: 2,
                opacity: isActive ? 1 : 0.3,
              }}
            />
          );
        })}
      </Pressable>

      {/* Tempo */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>
          {formatTime(currentTime)}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
}
