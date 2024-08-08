import { FFmpegKit } from 'ffmpeg-kit-react-native';

export async function getAudioAmplitudes(uri: string): Promise<number[]> {
  const output = '/path/to/output.csv'; // Defina um caminho para o arquivo de saída
  const command = `-i ${uri} -filter:a volumedetect -f null - 2> ${output}`;
  
  const result = await FFmpegKit.execute(command);
  if (result.returnCode !== 0) {
    throw new Error('Failed to process audio');
  }

  // Leia o arquivo de saída e extraia os dados de amplitude
  const response = await fetch(output);
  const text = await response.text();
  const lines = text.split('\n');
  const amplitudes = lines.map(line => {
    const match = line.match(/mean_volume: (-?\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  });

  return amplitudes;
}
