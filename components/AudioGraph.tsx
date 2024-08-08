import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getAudioAmplitudes } from '../services/audioUtils';

interface AudioGraphProps {
  uri: string;
}

const AudioGraph: React.FC<AudioGraphProps> = ({ uri }) => {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const amplitudes = await getAudioAmplitudes(uri);
        setData(amplitudes);
      } catch (error) {
        console.error('Failed to get audio data', error);
      }
    }

    fetchData();
  }, [uri]);

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <LineChart
          data={{
            labels: data.map((_, index) => index.toString()),
            datasets: [{ data }],
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default AudioGraph;
