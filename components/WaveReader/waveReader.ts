import * as FileSystem from 'expo-file-system';

/**
 * Função para ler um arquivo .wav do sistema e retornar os dados do chunk "data"
 * @param {string} fileName - O nome do arquivo .wav (deve estar na pasta do projeto ou caminho relativo)
 * @returns {Promise<Int16Array>} - Retorna uma promise com os dados de áudio ou lança um erro.
 */
export const readWavFile = async (fileName: string): Promise<Int16Array> => {
  try {
    // Caminho do arquivo (altere conforme necessário para seu projeto)
    const filePath = FileSystem.documentDirectory  + fileName;

    // Ler o arquivo como base64
    const base64Data = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Converter base64 para ArrayBuffer
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Criar DataView a partir do ArrayBuffer
    const dataView = new DataView(bytes.buffer);

    // Verifica o cabeçalho RIFF
    const riffHeader = String.fromCharCode(
      dataView.getUint8(0),
      dataView.getUint8(1),
      dataView.getUint8(2),
      dataView.getUint8(3)
    );
    if (riffHeader !== 'RIFF') {
      throw new Error('Este arquivo não é um WAV válido');
    }

    // Navegar para encontrar o chunk "data"
    let offset = 12; // Após "RIFF", "WAVE" e o tamanho
    while (offset < dataView.byteLength) {
      const chunkId = String.fromCharCode(
        dataView.getUint8(offset),
        dataView.getUint8(offset + 1),
        dataView.getUint8(offset + 2),
        dataView.getUint8(offset + 3)
      );
      const chunkSize = dataView.getUint32(offset + 4, true);

      if (chunkId === 'data') {
        console.log(`Chunk "data" encontrado. Tamanho: ${chunkSize} bytes`);
        const audioData = new Int16Array(bytes.buffer, offset + 8, chunkSize / 2);
        
        // Retorna os dados de áudio como Int16Array
        return audioData;
      }

      // Pular para o próximo chunk
      offset += 8 + chunkSize;
    }

    throw new Error('Chunk "data" não encontrado');
  } catch (error) {
    console.error('Erro ao ler o arquivo .wav:', error);
    throw error;
  }
};
