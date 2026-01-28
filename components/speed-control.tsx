import { View, Text, Pressable, ScrollView } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

/**
 * Componente para controlar a velocidade de reprodução
 */
export function SpeedControl({ currentSpeed, onSpeedChange }: SpeedControlProps) {
  const colors = useColors();

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
      <Text
        style={{
          color: colors.foreground,
          fontWeight: '600',
          marginBottom: 12,
          fontSize: 14,
        }}
      >
        Velocidade: {currentSpeed}x
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {SPEED_OPTIONS.map((speed) => (
          <Pressable
            key={speed}
            onPress={() => onSpeedChange(speed)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                currentSpeed === speed ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor:
                currentSpeed === speed ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                color:
                  currentSpeed === speed ? colors.background : colors.foreground,
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              {speed}x
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
