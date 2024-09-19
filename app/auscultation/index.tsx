import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, Text, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { Recording } from 'expo-av/build/Audio';
import MemoListItem from '../../components/MemoListItem/MemoListItem';
import AudioChart from '../../components/AudioChart/AudioChart';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface RecordingData {
  uri: string;
  meteringData: number[];
}

export default function App() {
  const [recording, setRecording] = useState<Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [memos, setMemos] = useState<RecordingData[]>([]);
  const [activeMemo, setActiveMemo] = useState<string | undefined>();
  const [currentMeteringData, setCurrentMeteringData] = useState<number[]>([0]);

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

      setCurrentMeteringData([]);
      recording.setProgressUpdateInterval(1);
      recording.setOnRecordingStatusUpdate((status) => {
        setCurrentMeteringData((prevData) => [...prevData, status.metering || 0]);
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

    if (uri) {
      setMemos((existingMemos) => [{uri: uri, meteringData: currentMeteringData } as RecordingData, ...existingMemos]);
    }

  }

  async function clearMemos() {
    setMemos([]);
  }

  async function clearMeteringData() {
    setCurrentMeteringData([0]);
  }


  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() => setCurrentMeteringData([0.000000,0.000000,0.000000,0.000031,-0.000031,0.000031,-0.000031,0.000031,-0.000031,0.000031,-0.000031,0.000031,-0.000031,0.000031,-0.000061,0.000061,-0.000031,0.000000,0.000031,-0.000092,0.000153,-0.000153,0.000122,-0.000092,0.000061,-0.000031,0.000031,-0.000031,0.000031,-0.000031,0.000031,0.000000,-0.000061,0.000092,-0.000092,0.000092,-0.000061,0.000000,0.000031,-0.000031,0.000061,-0.000092,0.000092,-0.000061,0.000031,0.000000,0.000000,-0.000031,0.000061,-0.000061,0.000031,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000031,-0.000031,0.000000,0.000031,-0.000031,0.000031,-0.000031,0.000000,0.000031,-0.000031,0.000000,0.000031,-0.000061,0.000061,-0.000031,0.000000,0.000031,-0.000061,0.000092,-0.000122,0.000122,-0.000092,0.000061,-0.000031,-0.000031,0.000061,-0.000061,0.000061,-0.000061,0.000031,0.000000,0.000000,0.000000,-0.000031,0.000031,0.000000,-0.000031,0.000061,-0.000092,0.000092,-0.000061,0.000031,-0.000031,0.000061,-0.000092,0.000122,-0.000122,0.000092,-0.000061,0.000031,0.000000,0.000000,-0.000031,0.000061,-0.000092,0.000122,-0.000092,0.000031,0.000000,-0.000031,0.000031,0.000031,-0.000061,0.000061,-0.000061,0.000000,0.000061,-0.000061,0.000061,-0.000061,0.000031,0.000000,0.000000,0.000000,0.000000,0.000000,0.000031,-0.000061,0.000061,-0.000031,-0.000031,0.000092,-0.000092,0.000061,0.000000,-0.000061,0.000061,-0.000061,0.000092,-0.000092,0.000092,-0.000092,0.000061,-0.000031,0.000000,0.000000,0.000031,-0.000031,0.000031,-0.000061,0.000031,0.000031,-0.000061,0.000092,-0.000122,0.000092,-0.000031,-0.000031,0.000061,-0.000061,0.000061,-0.000061,0.000061,-0.000061,0.000061,-0.000031,0.000000,0.000000,0.000000,0.000000,0.000031,-0.000061,0.000061,-0.000061,0.000061,-0.000031,0.000000,0.000031,-0.000061,0.000092])}
        style={{ backgroundColor: '#f0f0f0', borderColor: '#000', borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 }}
      >
        <Text>Plotar arquivos wav</Text>
      </Pressable>

      <ScrollView style={styles.listContainer}>
        {memos.map((memo) => (
          <MemoListItem
            uri={memo.uri}
            activeMemo={activeMemo}
            setActiveMemo={setActiveMemo}
            setCurrentMeteringData={setCurrentMeteringData}
            meteringData={memo.meteringData}
          />
        ))}
      </ScrollView>

      <AudioChart data={currentMeteringData} />

      <View style={styles.footer}>
        <Pressable style={styles.iconButton} onPress={clearMeteringData}>
          <MaterialIcons name="delete-sweep" size={24} color="gray" />
          <Text style={styles.iconText}>Limpar Gráfico</Text>
        </Pressable>

        <Pressable style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
          <View style={[styles.redCircle, { width: recording ? '80%' : '100%' }, { opacity: recording ? 0.5 : 1 }]} />
        </Pressable>

        <Pressable style={styles.iconButton} onPress={clearMemos}>
          <MaterialIcons name="delete" size={24} color="gray" />
          <Text style={styles.iconText}>Limpar Gravações</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 30,
    marginTop: 30,
  },
  listContainer: {
    flex: 1,
    marginBottom: 10,
  },
  footer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'row',
  },
  iconButton: {
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
  iconText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});