import * as _ from "lodash";
import { createStore, Store } from "redux";
import rootReducer, { AppState } from "../reducers/rootReducer";
import { devToolsEnhancer } from "redux-devtools-extension";
import { AppActions } from "../actions";

const version = "0.3";

interface FrozenState {
  version: string;
  state: AppState;
}

const store: Store<AppState, AppActions> = createStore(
  rootReducer,
  loadState(),
  devToolsEnhancer({})
);
export default store;

store.subscribe(
  _.throttle(() => {
    try {
      const frozenState: FrozenState = {
        version,
        state: store.getState(),
      };
      const serializedState = JSON.stringify(frozenState);
      localStorage.setItem("state", serializedState);
    } catch {
      // ignore write errors
    }
  }, 1000)
);

function loadState() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState) {
      const frozenState = JSON.parse(serializedState) as FrozenState;
      if (frozenState.version === version) {
        return frozenState.state;
      }
    }
  } catch (err) {
    console.warn(err);
  }
  return undefined;
}
