import { Text, View, Pressable, ScrollView, Alert, StyleSheet, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePlayer } from "@/hooks/use-player";
import { useMetadataExtractor } from "@/hooks/use-metadata-extractor";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";

export default function MenuScreen() {
  const colors = useColors();
  const { songs, addSongs, clearAll } = usePlayer();
  const { extractBatchMetadata } = useMetadataExtractor();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleAddMusic = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setShowMenu(false);
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
        
        let newSongs: any[] = result.assets.map((asset: any, index: number) => {
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

        console.log("Extraindo metadados das músicas...");
        newSongs = await extractBatchMetadata(newSongs);
        console.log("Adicionando músicas com metadados:", newSongs);
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
    setShowMenu(false);
    
    if (songs.length === 0) {
      Alert.alert("Playlist vazia", "Não há músicas para remover");
      return;
    }

    Alert.alert(
      "Limpar Tudo",
      `Tem certeza que deseja remover todas as ${songs.length} música${songs.length !== 1 ? "s" : ""}?`,
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Remover",
          onPress: async () => {
            await clearAll();
            Alert.alert("Sucesso", "Playlist limpa!");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Cabeçalho com Menu */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: colors.foreground,
          }}
        >
          Menu
        </Text>

        {/* Botão de Menu (Três Pontinhos) */}
        <Pressable
          onPress={() => setShowMenu(true)}
          style={{
            padding: 8,
            borderRadius: 8,
          }}
        >
          <MaterialIcons name="more-vert" size={24} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View style={{ gap: 16 }}>
          {/* Informações da Playlist */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <MaterialIcons name="music-note" size={28} color={colors.primary} />
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                Sua Playlist
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>
              Total de músicas: <Text style={{ fontWeight: "700", color: colors.foreground }}>{songs.length}</Text>
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              Toque no menu (⋯) para adicionar ou limpar
            </Text>
          </View>

          {/* Dicas de Uso */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <MaterialIcons name="info" size={24} color={colors.primary} />
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                Dicas
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 20 }}>
              • Use o menu (⋯) para adicionar músicas{"\n"}
              • Selecione múltiplos arquivos de uma vez{"\n"}
              • Vá para a aba "Playlist" para gerenciar{"\n"}
              • Use "Player" para ouvir suas músicas
            </Text>
          </View>

          {/* Versão do App */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
              SimPlay Mobile
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>
              v1.0.2
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
              Simple Player Offline
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal do Menu Dropdown */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-start",
            paddingTop: 60,
          }}
          onPress={() => setShowMenu(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              marginHorizontal: 12,
              borderRadius: 12,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Opção: Adicionar Músicas */}
            <Pressable
              onPress={handleAddMusic}
              disabled={loading}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                opacity: loading ? 0.6 : 1,
              }}
            >
              <MaterialIcons name="add-circle" size={24} color={colors.primary} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: colors.foreground,
                  marginLeft: 12,
                  flex: 1,
                }}
              >
                {loading ? "Adicionando..." : "Adicionar Músicas"}
              </Text>
            </Pressable>

            {/* Opção: Limpar Tudo */}
            <Pressable
              onPress={handleClearAll}
              disabled={songs.length === 0}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 14,
                opacity: songs.length === 0 ? 0.5 : 1,
              }}
            >
              <MaterialIcons name="delete" size={24} color={colors.error} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: songs.length === 0 ? colors.muted : colors.error,
                  marginLeft: 12,
                  flex: 1,
                }}
              >
                Limpar Tudo
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}
