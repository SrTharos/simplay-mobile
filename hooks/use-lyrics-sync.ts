import { useCallback, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncedLyric {
  text: string;
  timeMs: number; // timestamp em milissegundos
}

export interface LyricsData {
  lyrics: string[]; // array de linhas
  synced: SyncedLyric[]; // array de linhas sincronizadas
  isSynced: boolean;
}

/**
 * Hook para gerenciar sincronização de letras
 */
export function useLyricsSync(songId: string) {
  const [lyricsData, setLyricsData] = useState<LyricsData>({
    lyrics: [],
    synced: [],
    isSynced: false,
  });

  const storageKey = `lyrics_${songId}`;

  // Carregar letras ao iniciar
  useEffect(() => {
    loadLyrics();
  }, [songId]);

  const loadLyrics = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        setLyricsData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar letras:', error);
    }
  }, [storageKey]);

  // Salvar letras
  const saveLyrics = useCallback(
    async (data: LyricsData) => {
      setLyricsData(data);
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Erro ao salvar letras:', error);
      }
    },
    [storageKey]
  );

  // Processar texto de letras (dividir em linhas)
  const processLyrics = useCallback((text: string) => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newData: LyricsData = {
      lyrics: lines,
      synced: lines.map((text) => ({ text, timeMs: 0 })),
      isSynced: false,
    };

    saveLyrics(newData);
    return newData;
  }, [saveLyrics]);

  // Marcar tempo para uma linha
  const markTime = useCallback(
    (lineIndex: number, timeMs: number) => {
      if (lineIndex < 0 || lineIndex >= lyricsData.synced.length) return;

      const newSynced = [...lyricsData.synced];
      newSynced[lineIndex] = {
        ...newSynced[lineIndex],
        timeMs,
      };

      // Validar ordem crescente
      if (lineIndex > 0 && newSynced[lineIndex].timeMs < newSynced[lineIndex - 1].timeMs) {
        console.warn('Tempo deve ser maior que a linha anterior');
        return;
      }

      const newData = {
        ...lyricsData,
        synced: newSynced,
      };

      saveLyrics(newData);
    },
    [lyricsData, saveLyrics]
  );

  // Voltar ao tempo marcado (para revisar)
  const goToTime = useCallback((lineIndex: number) => {
    if (lineIndex >= 0 && lineIndex < lyricsData.synced.length) {
      return lyricsData.synced[lineIndex].timeMs;
    }
    return 0;
  }, [lyricsData]);

  // Finalizar sincronização
  const finalizeSyncedLyrics = useCallback(async () => {
    // Validar que todos os tempos foram marcados
    const allMarked = lyricsData.synced.every((lyric) => lyric.timeMs > 0 || lyricsData.synced.indexOf(lyric) === 0);

    if (!allMarked) {
      console.warn('Nem todas as linhas foram sincronizadas');
      return false;
    }

    const newData = {
      ...lyricsData,
      isSynced: true,
    };

    await saveLyrics(newData);
    return true;
  }, [lyricsData, saveLyrics]);

  // Obter linha atual baseado no tempo
  const getCurrentLyricIndex = useCallback(
    (currentTimeMs: number) => {
      if (!lyricsData.isSynced || lyricsData.synced.length === 0) return -1;

      for (let i = lyricsData.synced.length - 1; i >= 0; i--) {
        if (currentTimeMs >= lyricsData.synced[i].timeMs) {
          return i;
        }
      }

      return -1;
    },
    [lyricsData]
  );

  // Obter próximas linhas para exibição em cascata
  const getDisplayLyrics = useCallback(
    (currentTimeMs: number) => {
      const currentIndex = getCurrentLyricIndex(currentTimeMs);

      if (currentIndex === -1) {
        return {
          previous: [],
          current: null,
          next: lyricsData.synced.slice(0, 3),
        };
      }

      return {
        previous: lyricsData.synced.slice(Math.max(0, currentIndex - 2), currentIndex),
        current: lyricsData.synced[currentIndex],
        next: lyricsData.synced.slice(currentIndex + 1, currentIndex + 4),
      };
    },
    [lyricsData, getCurrentLyricIndex]
  );

  // Limpar letras
  const clearLyrics = useCallback(async () => {
    const newData: LyricsData = {
      lyrics: [],
      synced: [],
      isSynced: false,
    };

    await saveLyrics(newData);
  }, [saveLyrics]);

  return {
    lyricsData,
    processLyrics,
    markTime,
    goToTime,
    finalizeSyncedLyrics,
    getCurrentLyricIndex,
    getDisplayLyrics,
    clearLyrics,
  };
}
