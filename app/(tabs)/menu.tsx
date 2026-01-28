import { Text, View, Pressable, ScrollView, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePlayer } from "@/hooks/use-player";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import * as DocumentPicker from "expo-document-picker";

export default function MenuScreen() {
  const colors = useColors();
  const { songs, addSongs, clearAll } = usePlayer();

  const handleAddMusic = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        multiple: true,
      });

      if (result.assets && result.assets.length > 0) {
        const newSongs = result.assets.map((asset: any, index: number) => ({
          id: `song_${Date.now()}_${index}`,
          title: asset.name.replace(/\.[^/.]+$/, ""),
          filename: asset.name,
          type: asset.mimeType || "audio/mpeg",
          size: asset.size || 0,
          uri: asset.uri,
          added: new Date().toISOString(),
          lastPlayed: null,
        }));

        await addSongs(newSongs);
        Alert.alert(
          "Sucesso",
          `${newSongs.length} música${newSongs.length !== 1 ? "s" : ""} adicionada${newSongs.length !== 1 ? "s" : ""}!`
        );
      }
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      Alert.alert("Erro", "Não foi possível adicionar a música");
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Limpar Tudo",
      `Tem certeza que deseja remover todas as ${songs.length} música${songs.length !== 1 ? "s" : ""}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => clearAll(),
        },
      ]
    );
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    danger = false,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-4 p-4 rounded-lg border border-border mb-3 ${
        danger ? "bg-error bg-opacity-5 border-error" : "bg-surface"
      }`}
    >
      <MaterialIcons
        name={icon as any}
        size={24}
        color={danger ? colors.error : colors.primary}
      />
      <Text
        className={`text-base font-medium flex-1 ${
          danger ? "text-error" : "text-foreground"
        }`}
      >
        {label}
      </Text>
      <MaterialIcons
        name="chevron-right"
        size={24}
        color={danger ? colors.error : colors.muted}
      />
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4 gap-4">
          {/* Cabeçalho */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-foreground">Menu</Text>
            <Text className="text-sm text-muted mt-1">
              Gerencie sua playlist e configurações
            </Text>
          </View>

          {/* Seção Principal */}
          <View>
            <Text className="text-xs font-semibold text-muted uppercase mb-3">
              Gerenciamento
            </Text>

            <MenuItem
              icon="add-circle-outline"
              label="Adicionar Músicas"
              onPress={handleAddMusic}
            />

            <MenuItem
              icon="download"
              label="Exportar Playlist (JSON)"
              onPress={() =>
                Alert.alert(
                  "Em desenvolvimento",
                  "Esta funcionalidade será implementada em breve"
                )
              }
            />

            <MenuItem
              icon="download"
              label="Exportar Playlist (M3U)"
              onPress={() =>
                Alert.alert(
                  "Em desenvolvimento",
                  "Esta funcionalidade será implementada em breve"
                )
              }
            />

            <MenuItem
              icon="upload"
              label="Importar Playlist"
              onPress={() =>
                Alert.alert(
                  "Em desenvolvimento",
                  "Esta funcionalidade será implementada em breve"
                )
              }
            />
          </View>

          {/* Seção Perigosa */}
          <View className="mt-4">
            <Text className="text-xs font-semibold text-muted uppercase mb-3">
              Ações Destrutivas
            </Text>

            <MenuItem
              icon="delete-outline"
              label={`Limpar Tudo (${songs.length})`}
              onPress={handleClearAll}
              danger={true}
            />
          </View>

          {/* Informações */}
          <View className="mt-8 pt-4 border-t border-border">
            <Text className="text-xs font-semibold text-muted uppercase mb-3">
              Sobre
            </Text>

            <View className="bg-surface rounded-lg p-4 gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">App</Text>
                <Text className="text-sm font-semibold text-foreground">
                  SimPlay Mobile
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Versão</Text>
                <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Músicas</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {songs.length}
                </Text>
              </View>
            </View>

            <Text className="text-xs text-muted text-center mt-6">
              Simple Player Offline • Reprodutor de Áudio Local
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
