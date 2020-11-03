import * as uuid from "short-uuid";
import { createCode } from "../../arduino";
import { AudioActions } from "../actions/audioActions";

export interface SampleSet {
  readonly samples: number[];
  readonly id: string;
}

type AudioState = {
  sampleSets: SampleSet[];
  startPin: number;
  code: string;
};
const initialState: AudioState = {
  sampleSets: [],
  startPin: 9,
  code: ""
};
const audioReducer = (
  state: AudioState = initialState,
  action: AudioActions
): AudioState => {
  switch (action.type) {
    case "LOAD_SAMPLES": {
      const sampleSets = [...state.sampleSets, { samples: action.samples, id: uuid.generate() }]
      return {
        ...state,
        sampleSets,
        code: createCode(sampleSets, state.startPin)
      };
    }
    case "DELETE_SAMPLES": {
      const sampleSets = state.sampleSets.filter(set => set.id !== action.id)
      return {
        ...state,
        sampleSets,
        code: createCode(sampleSets, state.startPin)
      }
    }
    case "CHANGE_START_PIN": {
      return {
        ...state,
        startPin: action.startPin,
        code: createCode(state.sampleSets, action.startPin),
      };
    }
    default:
      return state;
  }
};
export default audioReducer;
