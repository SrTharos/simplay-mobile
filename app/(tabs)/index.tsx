import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePlayer } from "@/hooks/use-player";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { SpeedControl } from "@/components/speed-control";
import { AnimatedProgressBar } from "@/components/animated-progress-bar";
import { useLyricsSync } from "@/hooks/use-lyrics-sync";
import { LyricsEditorModal } from "@/components/lyrics-editor-modal";
import { LyricsDisplay } from "@/components/lyrics-display";
import { useState } from "react";

export default function HomeScreen() {
  const colors = useColors();
  const [showLyricsEditor, setShowLyricsEditor] = useState(false);
  const {
    songs,
    playbackState,
    currentTime,
    duration,
    togglePlayPause,
    next,
    prev,
    seek,
    toggleShuffle,
    toggleLoop,
    playbackSpeed,
    changeSpeed,
  } = usePlayer();

  const currentSongId = songs[playbackState.currentIndex]?.id || 'default';
  const {
    lyricsData,
    processLyrics,
    markTime,
    getDisplayLyrics,
  } = useLyricsSync(currentSongId);

  const displayLyrics = getDisplayLyrics(currentTime * 1000); // converter para ms

  const currentSong = songs[playbackState.currentIndex];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-between p-6">
          {/* Seção Superior - Informações da Música */}
          <View className="items-center gap-8">
            {/* Avatar */}
            <View
              className="w-48 h-48 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <MaterialIcons name="music-note" size={80} color={colors.primary} />
            </View>

            {/* Título e Artista */}
            <View className="items-center gap-2 w-full">
              <Text className="text-2xl font-bold text-foreground text-center">
                {currentSong?.title || "Nenhuma música"}
              </Text>
              {currentSong?.artist && (
                <Text className="text-base text-primary text-center">
                  {currentSong.artist}
                </Text>
              )}
              {currentSong?.album && (
                <Text className="text-sm text-muted text-center">
                  {currentSong.album}
                </Text>
              )}
              {!currentSong?.artist && !currentSong?.album && currentSong && (
                <Text className="text-sm text-muted text-center">
                  Música {playbackState.currentIndex + 1} de {songs.length}
                </Text>
              )}
              {!currentSong && (
                <Text className="text-sm text-muted text-center">
                  SimPlay-O • Simple Player Offline
                </Text>
              )}
            </View>
          </View>

          {/* Seção Central - Controles */}
          <View className="gap-6">
            {/* Visualizador de Áudio com Barra de Progresso */}
            <AnimatedProgressBar
              progress={progress}
              currentTime={currentTime}
              duration={duration}
              onSeek={(percent) => seek((percent / 100) * duration)}
            />

            {/* Botões de Controle */}
            <View className="flex-row justify-around items-center">
              <Pressable
                onPress={toggleShuffle}
                className={cn(
                  "p-3 rounded-full",
                  playbackState.shuffleMode ? "bg-primary" : "bg-surface"
                )}
              >
                <MaterialIcons
                  name="shuffle"
                  size={24}
                  color={playbackState.shuffleMode ? "white" : colors.foreground}
                />
              </Pressable>

              <Pressable onPress={prev} className="p-3 rounded-full bg-surface">
                <MaterialIcons name="skip-previous" size={28} color={colors.foreground} />
              </Pressable>

              <Pressable
                onPress={togglePlayPause}
                className="p-4 rounded-full bg-primary"
              >
                <MaterialIcons
                  name={playbackState.isPlaying ? "pause" : "play-arrow"}
                  size={32}
                  color="white"
                />
              </Pressable>

              <Pressable onPress={next} className="p-3 rounded-full bg-surface">
                <MaterialIcons name="skip-next" size={28} color={colors.foreground} />
              </Pressable>

              <Pressable
                onPress={toggleLoop}
                className={cn(
                  "p-3 rounded-full",
                  playbackState.loopMode > 0 ? "bg-primary" : "bg-surface"
                )}
              >
                <Text className="text-xs font-bold text-center w-6">
                  {playbackState.loopMode === 0
                    ? ""
                    : playbackState.loopMode === 1
                      ? "1"
                      : "∞"}
                </Text>
                <MaterialIcons
                  name="repeat"
                  size={24}
                  color={playbackState.loopMode > 0 ? "white" : colors.foreground}
                />
              </Pressable>
            </View>

            {/* Status de Loop/Shuffle */}
            {playbackState.shuffleMode && (
              <Text className="text-center text-sm text-primary">
                Modo aleatório ativado
              </Text>
            )}
            {playbackState.loopMode === 1 && (
              <Text className="text-center text-sm text-primary">
                Repetindo uma música
              </Text>
            )}
            {playbackState.loopMode === 2 && (
              <Text className="text-center text-sm text-primary">
                Repetindo playlist
              </Text>
            )}

            {/* Controle de Velocidade */}
            <SpeedControl
              currentSpeed={playbackSpeed}
              onSpeedChange={changeSpeed}
            />

            {/* Botão de Editar Letras */}
            {currentSong && (
              <Pressable
                onPress={() => setShowLyricsEditor(true)}
                className="bg-surface p-3 rounded-lg flex-row items-center justify-center gap-2 border border-border"
              >
                <MaterialIcons name="edit" size={20} color={colors.primary} />
                <Text className="text-primary font-semibold">
                  {lyricsData.isSynced ? "Ver Letras" : "Adicionar Letras"}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Exibir Letras Sincronizadas */}
          {lyricsData.isSynced && displayLyrics.current && (
            <LyricsDisplay
              previous={displayLyrics.previous}
              current={displayLyrics.current}
              next={displayLyrics.next}
            />
          )}

          {/* Seção Inferior - Contagem de Músicas */}
          <View className="items-center">
            <Text className="text-sm text-muted">
              {songs.length === 0
                ? "Nenhuma música adicionada"
                : `${songs.length} música${songs.length !== 1 ? "s" : ""}`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Editor de Letras */}
      <LyricsEditorModal
        visible={showLyricsEditor}
        onClose={() => setShowLyricsEditor(false)}
        lyricsData={lyricsData}
        currentTime={currentTime}
        onProcessLyrics={processLyrics}
        onMarkTime={markTime}
        onFinalize={() => {}}
      />
    </ScreenContainer>
  );
}
