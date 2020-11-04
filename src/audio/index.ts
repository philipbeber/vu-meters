import * as uuid from "short-uuid";
import { SampleSet } from "../model";

window.AudioContext =
  window.AudioContext || ((window as any).webkitAudioContext as AudioContext);

const audioContext = new AudioContext();

export const visualizeAudioFromUrl = (url: string, maxLength: number, sampleRate: number) => {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => visualizeAudioFromFile(arrayBuffer, maxLength, sampleRate));
};

export const visualizeAudioFromFile = (arrayBuffer: ArrayBuffer, maxLength: number, sampleRate: number) => {
    return audioContext.decodeAudioData(arrayBuffer)
      .then(audioBuffer => filterData(audioBuffer, maxLength, sampleRate))
}

// const sampleTime = 10; // how often (in ms) we output a sample
const windowSize = 1; // how big the window is that we sample, compared to sampleTime

const filterData = (audioBuffer: AudioBuffer, maxLength: number, sampleRate: number): SampleSet | undefined => {
  console.log("Input sample rate", audioBuffer.sampleRate);
  const rawData = audioBuffer.getChannelData(0); // TODO: Use more than one channel
  const frameCount = Math.floor(audioBuffer.sampleRate / sampleRate); // Number of frames in each sample
  const maxSamples = Math.min(rawData.length / frameCount, maxLength * sampleRate);
  console.log("Frame count", frameCount);
  const windowCount = frameCount * windowSize;
  if (rawData.length <= frameCount) {
      return;
  }
  let rollingSum = 0;
  for (let i = 0; i < windowCount; i++) {
      rollingSum += rawData[i] * rawData[i];
  }
  const samples = [] as number[];
  let maxSample = 0;
  for (let i = windowCount; i < rawData.length; i++) {
      if (i % frameCount === 0) {
          const sample = Math.sqrt(rollingSum / windowCount);
          samples.push(sample);
          maxSample = Math.max(sample, maxSample);
          if (samples.length >= maxSamples) {
              break;
          }
      }
      rollingSum -= rawData[i - windowCount] * rawData[i - windowCount];
      rollingSum += rawData[i] * rawData[i];
  }
  // Normalize to byte range
  return {
    id: uuid.generate(),
    msPerSample: Math.floor(1000 / sampleRate),
    samples: samples.map(sample => Math.floor(sample / maxSample * 255))
  }
};

