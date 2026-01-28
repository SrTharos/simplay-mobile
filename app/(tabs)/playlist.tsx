import { Text, View, Pressable, FlatList, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePlayer } from "@/hooks/use-player";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { FavoriteButton } from "@/components/favorite-button";

export default function PlaylistScreen() {
  const colors = useColors();
  const { songs, playbackState, play, removeSong } = usePlayer();
  const { toggleFavorite, isFavorite } = useFavorites(songs);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Hoje";
      if (diffDays === 2) return "Ontem";
      if (diffDays <= 7) return `Há ${diffDays} dias`;
      if (diffDays <= 30) return `Há ${Math.floor(diffDays / 7)} semanas`;

      return date.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  const handleRemove = (id: string, title: string) => {
    Alert.alert("Remover música", `Tem certeza que deseja remover "${title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removeSong(id),
      },
    ]);
  };

  const renderSongCard = ({ item, index }: { item: any; index: number }) => {
    const isPlaying = index === playbackState.currentIndex && playbackState.isPlaying;
    const isCurrent = index === playbackState.currentIndex;

    return (
      <Pressable
        onPress={() => play(index)}
        className={cn(
          "flex-row items-center gap-3 p-4 rounded-lg border border-border mb-2",
          isPlaying && "bg-primary bg-opacity-10 border-primary",
          isCurrent && !isPlaying && "bg-surface"
        )}
      >
        {/* Ícone */}
        <View className="w-10 h-10 items-center justify-center rounded-full bg-surface">
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={20}
            color={colors.primary}
          />
        </View>

        {/* Informações */}
        <View className="flex-1">
          <Text
            className={cn(
              "font-semibold",
              isPlaying ? "text-primary" : "text-foreground"
            )}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-xs text-muted" numberOfLines={1}>
            {formatFileSize(item.size)} • {formatDate(item.added)}
          </Text>
        </View>

        {/* Botão de Favorito */}
        <FavoriteButton
          isFavorite={isFavorite(item.id)}
          onPress={() => toggleFavorite(item.id)}
          size={20}
        />

        {/* Botão de Remover */}
        <Pressable
          onPress={() => handleRemove(item.id, item.title)}
          className="p-2"
        >
          <MaterialIcons name="close" size={20} color={colors.error} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 p-4">
        {/* Cabeçalho */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-foreground">Playlist</Text>
          <Text className="text-sm text-muted mt-1">
            {songs.length === 0
              ? "Nenhuma música"
              : `${songs.length} música${songs.length !== 1 ? "s" : ""}`}
          </Text>
        </View>

        {/* Lista de Músicas */}
        {songs.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <MaterialIcons name="music-note" size={64} color={colors.muted} />
            <Text className="text-lg font-semibold text-foreground">
              Sua playlist está vazia
            </Text>
            <Text className="text-sm text-muted text-center">
              Vá para o menu e adicione músicas para começar
            </Text>
          </View>
        ) : (
          <FlatList
            data={songs}
            renderItem={renderSongCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
