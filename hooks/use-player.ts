import { useEffect, useRef, useState, useCallback } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Song, PlaybackState } from '@/types';

const STORAGE_KEY = 'simplay_songs';
const STATE_KEY = 'simplay_state';

export function usePlayer() {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentIndex: 0,
    isPlaying: false,
    shuffleMode: false,
    loopMode: 0,
  });
  const currentSongRef = useRef<Song | null>(null);
  const isInitializedRef = useRef(false);

  // Inicializar modo de áudio
  useEffect(() => {
    const initAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error('Erro ao configurar modo de áudio:', error);
      }
    };

    if (!isInitializedRef.current) {
      initAudio();
      isInitializedRef.current = true;
    }
  }, []);

  // Carregar músicas do AsyncStorage
  const loadSongs = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const state = await AsyncStorage.getItem(STATE_KEY);
      
      if (stored) {
        const parsedSongs = JSON.parse(stored) as Song[];
        setSongs(parsedSongs);
      }
      
      if (state) {
        const parsedState = JSON.parse(state) as PlaybackState;
        setPlaybackState(parsedState);
      }
    } catch (error) {
      console.error('Erro ao carregar músicas:', error);
    }
  }, []);

  // Salvar músicas no AsyncStorage
  const saveSongs = useCallback(async (newSongs: Song[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSongs));
      setSongs(newSongs);
    } catch (error) {
      console.error('Erro ao salvar músicas:', error);
    }
  }, []);

  // Salvar estado de reprodução
  const savePlaybackState = useCallback(async (newState: PlaybackState) => {
    try {
      await AsyncStorage.setItem(STATE_KEY, JSON.stringify(newState));
      setPlaybackState(newState);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  }, []);

  // Tocar música
  const play = useCallback(async (index: number) => {
    if (!songs[index]) return;

    try {
      const song = songs[index];
      
      // Atualizar última reprodução
      const updatedSongs = [...songs];
      updatedSongs[index] = {
        ...song,
        lastPlayed: new Date().toISOString(),
      };
      await saveSongs(updatedSongs);

      // Carregar e tocar áudio
      // Usar replace() para mudar a fonte de áudio
      player.replace({ uri: song.uri });
      player.play();

      currentSongRef.current = song;
      setPlaybackState(prev => ({
        ...prev,
        currentIndex: index,
        isPlaying: true,
      }));
    } catch (error) {
      console.error('Erro ao tocar música:', error);
    }
  }, [songs, player, saveSongs]);

  // Pausar
  const pause = useCallback(async () => {
    try {
      player.pause();
      setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    } catch (error) {
      console.error('Erro ao pausar:', error);
    }
  }, [player]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (songs.length === 0) return;

    if (status.playing) {
      player.pause();
      setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    } else if (currentSongRef.current) {
      try {
        player.play();
        setPlaybackState(prev => ({ ...prev, isPlaying: true }));
      } catch {
        // Se falhar, recarregar a música
        await play(playbackState.currentIndex);
      }
    } else {
      await play(0);
    }
  }, [songs, status.playing, playbackState.currentIndex, pause, play, player]);

  // Próxima música
  const next = useCallback(async () => {
    if (songs.length === 0) return;

    let nextIndex: number;

    if (playbackState.loopMode === 1) {
      nextIndex = playbackState.currentIndex;
    } else if (playbackState.shuffleMode) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === playbackState.currentIndex && songs.length > 1);
    } else {
      nextIndex = (playbackState.currentIndex + 1) % songs.length;
    }

    await play(nextIndex);
  }, [songs, playbackState, play]);

  // Música anterior
  const prev = useCallback(async () => {
    if (songs.length === 0) return;

    // Se passou de 3 segundos, voltar ao início
    if (status.currentTime > 3) {
      try {
        await player.seekTo(0);
      } catch (error) {
        console.error('Erro ao buscar:', error);
      }
      return;
    }

    let prevIndex: number;

    if (playbackState.loopMode === 1) {
      prevIndex = playbackState.currentIndex;
    } else if (playbackState.shuffleMode) {
      do {
        prevIndex = Math.floor(Math.random() * songs.length);
      } while (prevIndex === playbackState.currentIndex && songs.length > 1);
    } else {
      prevIndex = (playbackState.currentIndex - 1 + songs.length) % songs.length;
    }

    await play(prevIndex);
  }, [songs, playbackState, status.currentTime, player, play]);

  // Buscar na música
  const seek = useCallback(async (time: number) => {
    try {
      await player.seekTo(time);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }
  }, [player]);

  // Toggle shuffle
  const toggleShuffle = useCallback(async () => {
    const newState = {
      ...playbackState,
      shuffleMode: !playbackState.shuffleMode,
    };
    await savePlaybackState(newState);
  }, [playbackState, savePlaybackState]);

  // Toggle loop
  const toggleLoop = useCallback(async () => {
    const newLoopMode = ((playbackState.loopMode + 1) % 3) as 0 | 1 | 2;
    const newState = {
      ...playbackState,
      loopMode: newLoopMode,
    };
    await savePlaybackState(newState);
  }, [playbackState, savePlaybackState]);

  // Adicionar músicas
  const addSongs = useCallback(async (newSongs: Song[]) => {
    const updated = [...songs, ...newSongs];
    await saveSongs(updated);
  }, [songs, saveSongs]);

  // Remover música
  const removeSong = useCallback(async (id: string) => {
    const updated = songs.filter(s => s.id !== id);
    await saveSongs(updated);

    // Se era a música em reprodução, parar
    if (songs[playbackState.currentIndex]?.id === id) {
      player.pause();
      setPlaybackState(prev => ({ ...prev, currentIndex: 0, isPlaying: false }));
    }
  }, [songs, playbackState, saveSongs, player]);

  // Mudar velocidade de reprodução
  const changeSpeed = useCallback(async (speed: number) => {
    if (speed >= 0.5 && speed <= 2) {
      try {
        await player.setPlaybackRate(speed);
        setPlaybackSpeed(speed);
        // Salvar preferência
        if (songs[playbackState.currentIndex]) {
          const songId = songs[playbackState.currentIndex].id;
          await AsyncStorage.setItem(`speed_${songId}`, speed.toString());
        }
      } catch (error) {
        console.error('Erro ao mudar velocidade:', error);
      }
    }
  }, [player, songs, playbackState]);

  // Limpar tudo
  const clearAll = useCallback(async () => {
    player.pause();
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(STATE_KEY);
    setSongs([]);
    setPlaybackState({
      currentIndex: 0,
      isPlaying: false,
      shuffleMode: false,
      loopMode: 0,
    });
  }, [player]);

  // Monitorar progresso e auto-play
  useEffect(() => {
    // Atualizar estado de reprodução
    setPlaybackState(prev => ({ ...prev, isPlaying: status.playing }));

    // Auto-play próxima música quando terminar
    if (
      status.didJustFinish &&
      status.playing &&
      (playbackState.loopMode === 2 || playbackState.shuffleMode || playbackState.loopMode === 1)
    ) {
      next();
    }
  }, [status, playbackState, next, songs]);

  // Carregar músicas ao montar
  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  return {
    songs,
    playbackState,
    currentTime: status.currentTime,
    duration: status.duration,
    play,
    pause,
    togglePlayPause,
    next,
    prev,
    seek,
    toggleShuffle,
    toggleLoop,
    addSongs,
    removeSong,
    clearAll,
    playbackSpeed,
    changeSpeed,
  };
}
