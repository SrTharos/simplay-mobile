import { Text, View, Pressable, ScrollView, Alert, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePlayer } from "@/hooks/use-player";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginHorizontal: 16,
  },
});

export default function MenuScreen() {
  const colors = useColors();
  const { songs, addSongs, clearAll } = usePlayer();
  const [loading, setLoading] = useState(false);

  const handleAddMusic = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      console.log("Abrindo seletor de documentos...");
      
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        multiple: true,
      });

      console.log("Resultado do DocumentPicker:", result);

      if (result.canceled) {
        console.log("Seleção cancelada pelo usuário");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        console.log(`${result.assets.length} arquivo(s) selecionado(s)`);
        
        const newSongs = result.assets.map((asset: any, index: number) => {
          const title = asset.name ? asset.name.replace(/\.[^/.]+$/, "") : `Música ${index + 1}`;
          return {
            id: `song_${Date.now()}_${index}`,
            title: title,
            filename: asset.name || `audio_${index}`,
            type: asset.mimeType || "audio/mpeg",
            size: asset.size || 0,
            uri: asset.uri,
            added: new Date().toISOString(),
            lastPlayed: null,
          };
        });

        console.log("Adicionando músicas:", newSongs);
        await addSongs(newSongs);
        
        Alert.alert(
          "Sucesso",
          `${newSongs.length} música${newSongs.length !== 1 ? "s" : ""} adicionada${newSongs.length !== 1 ? "s" : ""}!`
        );
      }
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      Alert.alert(
        "Erro",
        `Não foi possível adicionar a música: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (songs.length === 0) {
      Alert.alert("Playlist vazia", "Não há músicas para remover");
      return;
    }

    Alert.alert(
      "Limpar Tudo",
      `Tem certeza que deseja remover todas as ${songs.length} música${songs.length !== 1 ? "s" : ""}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            clearAll();
            Alert.alert("Sucesso", "Playlist limpa");
          },
        },
      ]
    );
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    danger = false,
    disabled = false,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
    disabled?: boolean;
  }) => {
    const backgroundColor = danger ? colors.error : colors.surface;
    const textColor = danger ? colors.error : colors.foreground;
    const iconColor = danger ? colors.error : colors.primary;
    const borderColor = danger ? colors.error : colors.border;

    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.menuItem,
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            opacity: pressed && !disabled ? 0.7 : 1,
          } as any,
        ]}
      >
        <MaterialIcons name={icon as any} size={24} color={iconColor} />
            <Text style={[styles.menuItemText, { color: textColor } as any]}>
          {label}
        </Text>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={danger ? colors.error : colors.muted}
        />
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 16, gap: 16 }}>
          {/* Cabeçalho */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.foreground }}>
              Menu
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
              Gerencie sua playlist e configurações
            </Text>
          </View>

          {/* Seção Principal */}
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.muted,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Gerenciamento
            </Text>

            <MenuItem
              icon="add-circle-outline"
              label={loading ? "Carregando..." : "Adicionar Músicas"}
              onPress={handleAddMusic}
              disabled={loading}
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
              disabled={songs.length === 0}
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
              disabled={songs.length === 0}
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
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.muted,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Ações Destrutivas
            </Text>

            <MenuItem
              icon="delete-outline"
              label={`Limpar Tudo (${songs.length})`}
              onPress={handleClearAll}
              danger={true}
              disabled={songs.length === 0}
            />
          </View>

          {/* Informações */}
          <View style={{ marginTop: 32, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.muted,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Sobre
            </Text>

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 16,
                gap: 8,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: colors.muted }}>App</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  SimPlay Mobile
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: colors.muted }}>Versão</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  1.0.0
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: colors.muted }}>Músicas</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  {songs.length}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                textAlign: "center",
                marginTop: 24,
              }}
            >
              Simple Player Offline • Reprodutor de Áudio Local
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
