import { useCallback, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Song } from '@/types';

export interface PlayHistory {
  songId: string;
  playedAt: string; // ISO timestamp
  duration: number; // segundos tocados
  completedPercent: number; // 0-100
}

export interface ListeningStats {
  totalPlayed: number;
  totalDuration: number;
  topSongs: Array<{ song: Song; playCount: number }>;
  topArtists: Array<{ artist: string; playCount: number }>;
  byDate: Record<string, number>; // YYYY-MM-DD -> count
}

const HISTORY_KEY = 'simplay_history';

/**
 * Hook para gerenciar histórico de reprodução e estatísticas
 */
export function useHistory(songs: Song[]) {
  const [history, setHistory] = useState<PlayHistory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar histórico ao iniciar
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setIsLoaded(true);
    }
  }, []);

  // Registrar reprodução
  const recordPlay = useCallback(
    async (songId: string, duration: number, completedPercent: number) => {
      const newEntry: PlayHistory = {
        songId,
        playedAt: new Date().toISOString(),
        duration,
        completedPercent,
      };

      const newHistory = [newEntry, ...history];
      setHistory(newHistory);

      try {
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Erro ao salvar histórico:', error);
      }
    },
    [history]
  );

  // Obter histórico filtrado por período
  const getHistoryByPeriod = useCallback(
    (days: number) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return history.filter(
        (entry) => new Date(entry.playedAt) > cutoffDate
      );
    },
    [history]
  );

  // Calcular estatísticas
  const stats = useMemo((): ListeningStats => {
    const topSongsMap = new Map<string, number>();
    const topArtistsMap = new Map<string, number>();
    const byDateMap = new Map<string, number>();
    let totalDuration = 0;

    history.forEach((entry) => {
      // Top songs
      topSongsMap.set(entry.songId, (topSongsMap.get(entry.songId) || 0) + 1);

      // Top artists
      const song = songs.find((s) => s.id === entry.songId);
      if (song?.artist) {
        topArtistsMap.set(song.artist, (topArtistsMap.get(song.artist) || 0) + 1);
      }

      // By date
      const date = new Date(entry.playedAt).toISOString().split('T')[0];
      byDateMap.set(date, (byDateMap.get(date) || 0) + 1);

      // Total duration
      totalDuration += entry.duration;
    });

    // Converter maps em arrays ordenados
    const topSongs = Array.from(topSongsMap.entries())
      .map(([songId, count]) => ({
        song: songs.find((s) => s.id === songId)!,
        playCount: count,
      }))
      .filter((item) => item.song)
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 10);

    const topArtists = Array.from(topArtistsMap.entries())
      .map(([artist, count]) => ({ artist, playCount: count }))
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 10);

    return {
      totalPlayed: history.length,
      totalDuration,
      topSongs,
      topArtists,
      byDate: Object.fromEntries(byDateMap),
    };
  }, [history, songs]);

  // Limpar histórico
  const clearHistory = useCallback(async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }, []);

  return {
    history,
    isLoaded,
    recordPlay,
    getHistoryByPeriod,
    stats,
    clearHistory,
  };
}
