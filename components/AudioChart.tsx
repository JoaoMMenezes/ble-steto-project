import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View } from 'react-native';

interface AudioChartProps {
  data: number[];
}

const AudioChart: React.FC<AudioChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  // Obtendo os últimos 20 elementos do array
  const last20Data = data.slice(-20);

  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 16, marginLeft: -screenWidth * 0.09}}>
      <LineChart
        data={{
          labels: [], // Você pode adicionar rótulos se necessário
          datasets: [
            {
              data: data,
              color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`, // Cor orangered para as linhas
            },
          ],
        }}
        width={screenWidth*1.1}
        height={320}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: "transparent",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "transparent",
          backgroundGradientToOpacity: 0,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`, // Cor orangered para as linhas
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
          backgroundColor: 'transparent', // Fundo transparente para o gráfico em si
        }}
      />
    </View>
  );
};

export default AudioChart;
