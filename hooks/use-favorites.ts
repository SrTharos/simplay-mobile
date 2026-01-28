import { useCallback, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Song } from '@/types';

/**
 * Hook para gerenciar favoritos
 * Persiste em AsyncStorage
 */
export function useFavorites(songs: Song[]) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar favoritos ao iniciar
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setIsLoaded(true);
    }
  }, []);

  // Alternar favorito
  const toggleFavorite = useCallback(
    async (songId: string) => {
      const newFavorites = favorites.includes(songId)
        ? favorites.filter((id) => id !== songId)
        : [...favorites, songId];

      setFavorites(newFavorites);

      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Erro ao salvar favorito:', error);
      }
    },
    [favorites]
  );

  // Verificar se é favorito
  const isFavorite = useCallback(
    (songId: string) => favorites.includes(songId),
    [favorites]
  );

  // Obter apenas favoritos
  const favoriteSongs = useMemo(() => {
    return songs
      .filter((song) => favorites.includes(song.id))
      .sort((a, b) => {
        const aIndex = favorites.indexOf(a.id);
        const bIndex = favorites.indexOf(b.id);
        return aIndex - bIndex;
      });
  }, [songs, favorites]);

  // Estatísticas de favoritos
  const favoriteStats = useMemo(() => {
    const favs = favoriteSongs;
    const totalDuration = favs.reduce((sum, song) => sum + (song.duration || 0), 0);
    const totalSize = favs.reduce((sum, song) => sum + song.size, 0);

    return {
      count: favs.length,
      totalDuration,
      totalSize,
      averageDuration: favs.length > 0 ? totalDuration / favs.length : 0,
    };
  }, [favoriteSongs]);

  return {
    favorites,
    isLoaded,
    toggleFavorite,
    isFavorite,
    favoriteSongs,
    favoriteStats,
  };
}
