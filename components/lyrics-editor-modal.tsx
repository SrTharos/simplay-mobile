import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { useState } from 'react';
import type { LyricsData } from '@/hooks/use-lyrics-sync';

interface LyricsEditorModalProps {
  visible: boolean;
  onClose: () => void;
  lyricsData: LyricsData;
  currentTime: number;
  onProcessLyrics: (text: string) => void;
  onMarkTime: (lineIndex: number, timeMs: number) => void;
  onFinalize: () => void;
}

type EditorPage = 'input' | 'sync';

/**
 * Modal para editar e sincronizar letras
 */
export function LyricsEditorModal({
  visible,
  onClose,
  lyricsData,
  currentTime,
  onProcessLyrics,
  onMarkTime,
  onFinalize,
}: LyricsEditorModalProps) {
  const colors = useColors();
  const [page, setPage] = useState<EditorPage>('input');
  const [inputText, setInputText] = useState('');
  const [currentSyncIndex, setCurrentSyncIndex] = useState(0);

  const handleProcessLyrics = () => {
    if (!inputText.trim()) {
      Alert.alert('Erro', 'Cole a letra antes de continuar');
      return;
    }

    onProcessLyrics(inputText);
    setPage('sync');
  };

  const handleMarkTime = () => {
    onMarkTime(currentSyncIndex, Math.floor(currentTime * 1000)); // converter para ms
    
    // Ir para próxima linha
    if (currentSyncIndex < lyricsData.synced.length - 1) {
      setCurrentSyncIndex(currentSyncIndex + 1);
    } else {
      Alert.alert('Sucesso', 'Todas as linhas foram sincronizadas!');
      onFinalize();
      onClose();
    }
  };

  const handleGoToTime = () => {
    // Retornar o tempo marcado (será usado pelo player para fazer seek)
    const timeMs = lyricsData.synced[currentSyncIndex]?.timeMs || 0;
    return timeMs / 1000; // converter para segundos
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.surface,
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold' }}>
            {page === 'input' ? 'Editar Letras' : 'Sincronizar Tempos'}
          </Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Conteúdo */}
        <ScrollView style={{ flex: 1, padding: 16 }}>
          {page === 'input' ? (
            // PÁGINA 1: Colar Letra
            <View style={{ gap: 16 }}>
              <Text style={{ color: colors.muted, fontSize: 14 }}>
                Cole a letra completa abaixo (uma linha por vez):
              </Text>

              <TextInput
                multiline
                numberOfLines={12}
                placeholder="Cole a letra aqui..."
                placeholderTextColor={colors.muted}
                value={inputText}
                onChangeText={setInputText}
                style={{
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  fontFamily: 'monospace',
                }}
              />

              <Text style={{ color: colors.muted, fontSize: 12 }}>
                Linhas detectadas: {inputText.split('\n').filter((l) => l.trim()).length}
              </Text>
            </View>
          ) : (
            // PÁGINA 2: Sincronizar Tempos
            <View style={{ gap: 16 }}>
              {/* Linha Atual */}
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>
                  Linha {currentSyncIndex + 1} de {lyricsData.synced.length}
                </Text>
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                  numberOfLines={3}
                >
                  {lyricsData.synced[currentSyncIndex]?.text}
                </Text>
              </View>

              {/* Tempo Marcado */}
              {lyricsData.synced[currentSyncIndex]?.timeMs > 0 && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    padding: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.background, fontSize: 12, marginBottom: 4 }}>
                    Tempo Marcado
                  </Text>
                  <Text
                    style={{
                      color: colors.background,
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                    }}
                  >
                    {Math.floor(lyricsData.synced[currentSyncIndex].timeMs / 1000 / 60)}:
                    {String(
                      Math.floor((lyricsData.synced[currentSyncIndex].timeMs / 1000) % 60)
                    ).padStart(2, '0')}
                  </Text>
                </View>
              )}

              {/* Instruções */}
              <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 20 }}>
                1. Clique "Play" na música{'\n'}
                2. Quando a linha começar, clique "⏱️ Marcar Tempo"{'\n'}
                3. Se errou, clique "↩️ Voltar" para revisar{'\n'}
                4. Próxima linha automaticamente
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer com Botões */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
          }}
        >
          {page === 'input' ? (
            <Pressable
              onPress={handleProcessLyrics}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 16 }}>
                Sincronizar Tempos
              </Text>
            </Pressable>
          ) : (
            <>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={handleMarkTime}
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="schedule" size={20} color={colors.background} />
                  <Text style={{ color: colors.background, fontWeight: 'bold' }}>
                    ⏱️ Marcar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    const timeMs = lyricsData.synced[currentSyncIndex]?.timeMs || 0;
                    if (timeMs > 0) {
                      // Aqui seria chamado o seek do player
                      console.log(`Voltar para ${timeMs}ms`);
                    }
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <MaterialIcons name="undo" size={20} color={colors.foreground} />
                  <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>↩️ Voltar</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={onClose}
                style={{
                  backgroundColor: colors.surface,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>Cancelar</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
