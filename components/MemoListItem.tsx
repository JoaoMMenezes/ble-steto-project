import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { AVPlaybackStatus, Audio } from 'expo-av';
import { Sound } from "expo-av/build/Audio";

interface MemoListItemProps {
  uri: string;
  activeMemo: string | undefined;
  setActiveMemo: React.Dispatch<SetStateAction<string | undefined>>;
}

const MemoListItem: React.FC<MemoListItemProps> = ({ uri, activeMemo, setActiveMemo }) => {
  const [sound, setSound] = useState<Sound>();
  const [status, setStatus] = useState<AVPlaybackStatus>();

  async function loadSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      undefined,
      onPlaybackStatusUpdate
    );
    setSound(sound);
  }

  async function playSound() {
    if (!sound) {
      return;
    }

    console.log('Playing Sound');
    await sound.setPositionAsync(0);
    await sound.setProgressUpdateIntervalAsync(1);
    await sound.playAsync();
  }

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus: AVPlaybackStatus) => {
      setStatus(newStatus);
    },
    [sound]
  );

  useEffect(() => {
    loadSound();
  }, [uri]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const position = status?.isLoaded ? status.positionMillis : 0;
  const duration = status?.isLoaded ? status.durationMillis : 1;
  const progress = (position / (duration || 1)) * 100;

  const isPlaying = status?.isLoaded ? status.isPlaying : false;
  const isActive = activeMemo === uri;

  return (
    <View style={[style.container, isActive && style.activeItem]}>
      <FontAwesome5
        name={isPlaying ? 'pause' : 'play'}
        size={20}
        color={'gray'}
        onPress={() => {
          playSound();
          setActiveMemo(uri);
        }}
      />

      <View style={style.playbackContainer}>
        <View style={style.playbackBackground} />
        <View style={[style.playbackIndicator, { left: `${progress}%` }]} />
      </View>
      <Text>{duration}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 5,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  activeItem: {
    backgroundColor: 'lightblue',
  },
  playbackContainer: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
  },
  playbackBackground: {
    height: 1,
    backgroundColor: 'grey',
  },
  playbackIndicator: {
    width: 8,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: 'royalblue',
    position: 'absolute',
  },
});

export default MemoListItem;