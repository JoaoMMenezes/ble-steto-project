import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { Recording } from 'expo-av/build/Audio';
import MemoListItem from './components/MemoListItem';
import AudioChart from './components/AudioChart'; // Importe o novo componente

export default function App() {
  const [recording, setRecording] = useState<Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [memos, setMemos] = useState<string[]>([]);
  const [activeMemo, setActiveMemo] = useState<string | undefined>();
  const [meteringData, setMeteringData] = useState<number[]>([0]);
  const [showChart, setShowChart] = useState(true);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
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

      recording.setProgressUpdateInterval(1);
      recording.setOnRecordingStatusUpdate((status) => {
        setMeteringData((prevData) => [...prevData, status.metering || 0]);
      });
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
    console.log('Metering data:', meteringData);

    if (uri) {
      setMemos((existingMemos) => [uri, ...existingMemos]);
    }

    setShowChart(true); // Mostra o gráfico após parar a gravação
  }

  async function clearMemos() {
    setMemos([]);
  }

  async function clearMeteringData() {
    setMeteringData([0]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={memos}
        renderItem={({ item }) => (
          <MemoListItem uri={item} activeMemo={activeMemo} setActiveMemo={setActiveMemo} />
        )}
        keyExtractor={(item) => item}
      />

      {showChart && <AudioChart data={meteringData} />}

      <View style={styles.footer}>
        <View style={styles.footer}>
          <Pressable
            style={styles.recordButton}
            onPress={clearMeteringData}
          >
            <View
              style={styles.deleteButton}
            />
          </Pressable>
        </View>
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
        <View style={styles.footer}>
          <Pressable
            style={styles.recordButton}
            onPress={clearMemos}
          >
            <View
              style={styles.deleteButton}
            />
          </Pressable>
        </View>

      </View>
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
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'row',
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
  deleteButton: {
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
