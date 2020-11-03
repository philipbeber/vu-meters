import { SampleSet } from "../redux/reducers/audioReducer";

function declareVariables(set: SampleSet, pin: number) {
    return `int pin${pin} = ${pin};
char pin${pin}data[] = { ${set.samples.map(sample => `0x${sample.toString(16)}`).join(", ")} };
`
}

function setPinMode(set: SampleSet, pin: number) {
    return `  pinMode(pin${pin}, OUTPUT);`
}

function writePin(set: SampleSet, pin: number) {
    return `  analogWrite(pin${pin}, pin${pin}data[index]);`
}

export function createCode(sampleSets: SampleSet[], startPin: number) {

const code = `
${sampleSets.map((set, index) => declareVariables(set, startPin + index)).join("\n")}

unsigned long startTime;

void setup()
{
${sampleSets.map((set, index) => setPinMode(set, startPin + index)).join("\n")}
  startTime = millis();
}

void loop() {

  unsigned long timeNow = millis();
  unsigned int index = ((timeNow - startTime) / 10000) % 3;

${sampleSets.map((set, index) => writePin(set, startPin + index)).join("\n")}
}
`

console.log(code);
return code;
}