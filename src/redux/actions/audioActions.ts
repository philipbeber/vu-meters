import { SampleSet } from "../../model";

export interface ILoadSamples {
  readonly type: "LOAD_SAMPLES";
  sampleSet: SampleSet;
}

export interface IDeleteSamples {
  readonly type: "DELETE_SAMPLES";
  id: string;
}

export interface IChangeStartPin {
  readonly type: "CHANGE_START_PIN";
  startPin: number;
}

export interface IChangeSampleRate {
  readonly type: "CHANGE_SAMPLE_RATE";
  sampleRate: number;
}

export type AudioActions = ILoadSamples | IDeleteSamples | IChangeStartPin | IChangeSampleRate;
