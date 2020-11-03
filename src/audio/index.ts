window.AudioContext =
  window.AudioContext || ((window as any).webkitAudioContext as AudioContext);

const audioContext = new AudioContext();

export const visualizeAudioFromUrl = (url: string, maxSamples: number) => {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => visualizeAudioFromFile(arrayBuffer, maxSamples));
};

export const visualizeAudioFromFile = (arrayBuffer: ArrayBuffer, maxSamples: number) => {
    return audioContext.decodeAudioData(arrayBuffer)
      .then(audioBuffer => filterData(audioBuffer, maxSamples))
}

const sampleTime = 100; // how often (in ms) we output a sample
const windowSize = 3; // how big the window is that we sample, compared to sampleTime

const filterData = (audioBuffer: AudioBuffer, maxSamples: number) => {
  const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
  const sampleCount = sampleTime / 1000 * audioBuffer.sampleRate;
  const windowCount = sampleCount * windowSize;
  if (rawData.length <= sampleCount) {
      return;
  }
  let rollingSum = 0;
  for (let i = 0; i < windowCount; i++) {
      rollingSum += rawData[i] * rawData[i];
  }
  const samples = [] as number[];
  let maxSample = 0;
  for (let i = windowCount; i < rawData.length; i++) {
      if (i % sampleCount === 0) {
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
  return samples.map(sample => Math.floor(sample / maxSample * 255));
};

