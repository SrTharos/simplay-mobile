import { useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
// @ts-ignore - jsmediatags não tem tipos TypeScript
import jsmediatags from 'jsmediatags';
import type { Song } from '@/types';

export function useMetadataExtractor() {
  /**
   * Extrai metadados ID3 de um arquivo de áudio
   * Suporta ID3v2 (MP3) e metadados de outros formatos
   */
  const extractMetadata = useCallback(
    async (song: Song): Promise<Partial<Song>> => {
      try {
        console.log(`Extraindo metadados de: ${song.filename}`);

        // Ler arquivo como base64
        const base64Data = await FileSystem.readAsStringAsync(song.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Converter base64 para ArrayBuffer
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        // Usar jsmediatags para ler metadados
        return new Promise((resolve) => {
          jsmediatags.read(arrayBuffer, {
            onSuccess: (tag: any) => {
              console.log('Metadados encontrados:', tag);

              const tags = tag.tags;
              const metadata: Partial<Song> = {};

              // Extrair título
              if (tags.title) {
                metadata.title = tags.title;
              }

              // Extrair artista
              if (tags.artist) {
                metadata.artist = tags.artist;
              }

              // Extrair álbum
              if (tags.album) {
                metadata.album = tags.album;
              }

              // Extrair duração
              if (tag.info?.duration) {
                metadata.duration = tag.info.duration;
              }

              // Extrair capa do álbum
              if (tags.picture) {
                try {
                  const picture = tags.picture;
                  const base64Image = String.fromCharCode.apply(
                    null,
                    new Uint8Array(picture.data) as any
                  );
                  metadata.albumArt = `data:${picture.format};base64,${btoa(base64Image)}`;
                  console.log('Capa do álbum extraída');
                } catch (error) {
                  console.warn('Erro ao extrair capa do álbum:', error);
                }
              }

              resolve(metadata);
            },
            onError: (error: any) => {
              console.warn(`Erro ao ler metadados: ${error}`);
              // Retornar vazio em caso de erro (usar fallback)
              resolve({});
            },
          });
        });
      } catch (error) {
        console.error('Erro ao extrair metadados:', error);
        return {};
      }
    },
    []
  );

  /**
   * Extrai metadados de múltiplas músicas
   */
  const extractBatchMetadata = useCallback(
    async (songs: Song[]): Promise<Song[]> => {
      const updatedSongs = await Promise.all(
        songs.map(async (song) => {
          const metadata = await extractMetadata(song);
          return {
            ...song,
            ...metadata,
          };
        })
      );

      return updatedSongs;
    },
    [extractMetadata]
  );

  return {
    extractMetadata,
    extractBatchMetadata,
  };
}
