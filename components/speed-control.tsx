import { View, Text, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import { useColors } from '@/hooks/use-colors';

interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

/**
 * Botão compacto de controle de velocidade com modal de seleção
 */
export function SpeedControl({ currentSpeed, onSpeedChange }: SpeedControlProps) {
  const colors = useColors();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Botão compacto no canto */}
      <Pressable
        onPress={() => setShowModal(true)}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <Text
          style={{
            color: colors.background,
            fontWeight: '700',
            fontSize: 12,
          }}
        >
          {currentSpeed}x
        </Text>
      </Pressable>

      {/* Modal com opções de velocidade */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              width: '80%',
              maxWidth: 300,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              style={{
                color: colors.foreground,
                fontWeight: '600',
                fontSize: 16,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Velocidade: {currentSpeed}x
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
              }}
            >
              {SPEED_OPTIONS.map((speed) => (
                <Pressable
                  key={speed}
                  onPress={() => {
                    onSpeedChange(speed);
                    setShowModal(false);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor:
                      currentSpeed === speed ? colors.primary : colors.background,
                    borderWidth: 1,
                    borderColor:
                      currentSpeed === speed ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      color:
                        currentSpeed === speed
                          ? colors.background
                          : colors.foreground,
                      fontWeight: '600',
                      fontSize: 12,
                    }}
                  >
                    {speed}x
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
