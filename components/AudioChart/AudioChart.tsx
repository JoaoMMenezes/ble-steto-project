import React, { useRef, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, ScrollView } from 'react-native';

interface AudioChartProps {
  data: number[];
}

const AudioChart: React.FC<AudioChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);

  let modifiedData = data.length > 2 ? data.slice(1, -1) : data;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [data]); 

  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 16 }}>
      <ScrollView
        horizontal
        ref={scrollViewRef} // Atribui a referência ao ScrollView
      >
        <LineChart
          data={{
            labels: [],
            datasets: [
              {
                data: modifiedData,
                color: (opacity = 1) => `rgba(255, 69, 0, 0.4)`,
              },
            ],
          }}
          width={Math.max(screenWidth, modifiedData.length * 6)}
          height={320}
          yAxisLabel=""
          yAxisSuffix=""
          withShadow={false}
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "transparent",
            backgroundGradientToOpacity: 0,
            decimalPlaces: 4,
            color: (opacity = 1) => `transparent`,
            labelColor: (opacity = 1) => `#fff`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '0',
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
