/**
 * Tipos TypeScript para SimPlay Mobile
 */

export interface Song {
  id: string;
  title: string;
  filename: string;
  type: string;
  size: number;
  uri: string; // Local file URI
  added: string; // ISO date string
  lastPlayed: string | null; // ISO date string
  // Metadados ID3
  artist?: string;
  album?: string;
  albumArt?: string; // Base64 ou URI da imagem
  duration?: number; // Duração em segundos
}

export interface PlaybackState {
  currentIndex: number;
  isPlaying: boolean;
  shuffleMode: boolean;
  loopMode: 0 | 1 | 2; // 0: off, 1: one, 2: all
}

export interface PlayerContextType {
  songs: Song[];
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  play: (index: number) => Promise<void>;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  addSongs: (songs: Song[]) => Promise<void>;
  removeSong: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export interface ExportFormat {
  type: 'json' | 'm3u';
  data: string;
  filename: string;
}
