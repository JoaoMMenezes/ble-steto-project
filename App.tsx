import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { Recording } from 'expo-av/build/Audio';
import MemoListItem from './components/MemoListItem';
import AudioGraph from './components/AudioGraph';

export default function App() {
  const [recording, setRecording] = useState<Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [memos, setMemos] = useState<string[]>([]);
  const [activeMemo, setActiveMemo] = useState<string | undefined>();

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }

    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    if (uri) {
      setMemos((existingMemos) => [uri, ...existingMemos]);
    }
  }

  useEffect(() => {
    console.log(activeMemo);
  }, [activeMemo]);

  return (
    <View style={styles.container}>
      <FlatList
        data={memos}
        renderItem={({ item }) => (
          <MemoListItem uri={item} activeMemo={activeMemo} setActiveMemo={setActiveMemo} />
        )}
        keyExtractor={(item) => item}
      />

      <View style={styles.footer}>
        <Pressable
          style={styles.recordButton}
          onPress={recording ? stopRecording : startRecording}
        >
          <View
            style={[
              styles.redCircle,
              { width: recording ? '80%' : '100%' },
              { opacity: recording ? 0.5 : 1 },
            ]}
          />
        </Pressable>
      </View>
      {/* {activeMemo && <AudioGraph uri={activeMemo} />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    paddingTop: 10,
    marginTop: 30,
  },
  footer: {
    backgroundColor: 'white',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'gray',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redCircle: {
    aspectRatio: 1,
    backgroundColor: 'orangered',
    borderRadius: 30,
  },
});
