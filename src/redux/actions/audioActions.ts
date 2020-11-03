export interface ILoadSamples {
  readonly type: "LOAD_SAMPLES";
  samples: number[];
}

export interface IDeleteSamples {
  readonly type: "DELETE_SAMPLES";
  id: string;
}

export interface IChangeStartPin {
  readonly type: "CHANGE_START_PIN";
  startPin: number;
}

export type AudioActions = ILoadSamples | IDeleteSamples | IChangeStartPin;
