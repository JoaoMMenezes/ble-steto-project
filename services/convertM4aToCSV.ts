const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const wav = require('wav-decoder');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const inputFile = 'seu_arquivo.m4a';
const outputFile = 'seu_arquivo.wav';

function convertToWav(inputFile, outputFile, callback) {
  ffmpeg(inputFile)
    .toFormat('wav')
    .on('end', () => {
      console.log('Conversão para WAV concluída.');
      callback(outputFile);
    })
    .on('error', (err) => {
      console.error('Erro durante a conversão:', err);
    })
    .save(outputFile);
}

function extractAmplitudes(wavFile) {
  fs.readFile(wavFile, (err, buffer) => {
    if (err) throw err;
    const decoded = wav.decode.sync(buffer);
    const samples = decoded.channelData[0]; // Assume áudio mono

    saveAmplitudesToCSV(samples);
  });
}

function saveAmplitudesToCSV(amplitudes) {
  const csvWriter = createCsvWriter({
    path: 'amplitudes.csv',
    header: [{ id: 'amplitude', title: 'Amplitude' }]
  });

  const records = amplitudes.map(amp => ({ amplitude: amp }));

  csvWriter.writeRecords(records)
    .then(() => {
      console.log('Amplitudes salvas em amplitudes.csv');
    })
    .catch(err => {
      console.error('Erro ao salvar o arquivo CSV:', err);
    });
}

convertToWav(inputFile, outputFile, extractAmplitudes);
