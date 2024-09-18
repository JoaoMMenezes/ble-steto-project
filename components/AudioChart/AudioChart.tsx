import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, ScrollView } from 'react-native';

interface AudioChartProps {
  data: number[];
}

const AudioChart: React.FC<AudioChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  let modifiedData = data.length > 2 ? data.slice(1, -1) : data;

  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 16 }}>
      <ScrollView horizontal>
        <LineChart
          data={{
            labels: [], 
            datasets: [
              {
                data: modifiedData,
                color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
              },
            ],
          }}
          width={Math.max(screenWidth, modifiedData.length * 10)}
          height={320}
          yAxisLabel=""
          yAxisSuffix=" dB"
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "transparent",
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '2',
              strokeWidth: '1',
              stroke: 'orangered',
            },
            propsForHorizontalLabels: {
              fontSize: 10,
            },
          }}
          bezier
          withVerticalLines={false}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            backgroundColor: 'transparent',
          }}
        />
      </ScrollView>
    </View>
  );
};

export default AudioChart;
