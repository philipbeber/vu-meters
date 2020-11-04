import { createCode } from "../../arduino";
import { SampleSet } from "../../model";
import { AudioActions } from "../actions/audioActions";

type AudioState = {
  sampleSets: SampleSet[];
  startPin: number;
  sampleRate: number;
  code: string;
};
const initialState: AudioState = {
  sampleSets: [],
  startPin: 9,
  sampleRate: 100,
  code: ""
};
const audioReducer = (
  state: AudioState = initialState,
  action: AudioActions
): AudioState => {
  switch (action.type) {
    case "LOAD_SAMPLES": {
      const sampleSets = [...state.sampleSets, action.sampleSet]
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
    case "CHANGE_SAMPLE_RATE": {
      return {
        ...state,
        sampleRate: action.sampleRate
      };
    }
    default:
      return state;
  }
};
export default audioReducer;

export function restoreFromFrozen(state: AudioState) {
  const newState: AudioState = {
    ...initialState,
    ...state
  }
  return {
    ...newState,
    code: createCode(newState.sampleSets, newState.startPin)
  }
}
