import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}

/**
 * Botão de favorito com feedback háptico
 */
export function FavoriteButton({
  isFavorite,
  onPress,
  size = 24,
}: FavoriteButtonProps) {
  const colors = useColors();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
      ]}
    >
      <MaterialIcons
        name={isFavorite ? 'favorite' : 'favorite-border'}
        size={size}
        color={isFavorite ? '#FF6B6B' : colors.muted}
      />
    </Pressable>
  );
}
