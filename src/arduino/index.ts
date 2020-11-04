import { SampleSet } from "../model";

function declareVariables(set: SampleSet, pin: number) {
  return `int pin${pin} = ${pin};
const unsigned char pin${pin}data[] PROGMEM = { ${set.samples
    .map((sample) => `0x${sample.toString(16)}`)
    .join(", ")} };
`;
}

function setPinMode(set: SampleSet, pin: number) {
  return `  pinMode(pin${pin}, OUTPUT);`;
}

function writePin(set: SampleSet, pin: number) {
  return `  analogWrite(pin${pin}, pgm_read_byte_near(pin${pin}data + ((index / ${set.msPerSample}) % ${set.samples.length})));`;
}

export function createCode(sampleSets: SampleSet[], startPin: number) {
  if (!sampleSets.length) {
    return "";
  }

  const code = `
#include <avr/pgmspace.h>

${sampleSets
  .map((set, index) => declareVariables(set, startPin + index))
  .join("\n")}

unsigned long startTime;

void setup()
{
${sampleSets.map((set, index) => setPinMode(set, startPin + index)).join("\n")}
  startTime = millis();
}

void loop() {

  unsigned long timeNow = millis();
  unsigned int index = timeNow - startTime;

${sampleSets.map((set, index) => writePin(set, startPin + index)).join("\n")}
}
`;

  return code;
}
