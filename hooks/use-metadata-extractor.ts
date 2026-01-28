import { useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
// @ts-ignore - id3-parser não tem tipos TypeScript
import ID3Parser from 'id3-parser';
import type { Song } from '@/types';

export function useMetadataExtractor() {
  /**
   * Extrai metadados ID3 de um arquivo de áudio
   * Suporta ID3v2 (MP3) e outros formatos
   */
  const extractMetadata = useCallback(
    async (song: Song): Promise<Partial<Song>> => {
      try {
        console.log(`Extraindo metadados de: ${song.filename}`);

        // Ler arquivo como base64
        const base64Data = await FileSystem.readAsStringAsync(song.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Converter base64 para Buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Usar ID3Parser para ler metadados
        const parser = new (ID3Parser as any)(buffer);
        const tags = parser.getTag();

        console.log('Metadados encontrados:', tags);

        const metadata: Partial<Song> = {};

        if (tags) {
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

          // Extrair duração (se disponível)
          if (tags.duration) {
            metadata.duration = tags.duration;
          }

          // Extrair capa do álbum
          if (tags.image) {
            try {
              const imageData = tags.image;
              if (imageData.imageBuffer) {
                const base64Image = imageData.imageBuffer.toString('base64');
                const mimeType = imageData.mime || 'image/jpeg';
                metadata.albumArt = `data:${mimeType};base64,${base64Image}`;
                console.log('Capa do álbum extraída');
              }
            } catch (error) {
              console.warn('Erro ao extrair capa do álbum:', error);
            }
          }
        }

        return metadata;
      } catch (error) {
        console.warn(`Erro ao ler metadados: ${error}`);
        // Retornar vazio em caso de erro (usar fallback)
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
