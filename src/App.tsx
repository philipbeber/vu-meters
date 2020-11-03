import React, { Dispatch, Fragment, useState } from "react";
import "./App.css";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import {visualizeAudioFromFile, visualizeAudioFromUrl} from "./audio";
import { useDispatch, useSelector } from "react-redux";
import { AudioActions } from "./redux/actions/audioActions";
import { AppState } from "./redux/reducers/rootReducer";
import BarChart from "./BarChart";
import CopyToClipboard from 'react-copy-to-clipboard';

const defaultUrl =
  "https://archive.org/download/groovelinehorns2009-10-11.mk4.flac16/groovelinehorns2009-10-11t02.mp3";

const maxSamples = 300;

function App() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(defaultUrl);
  const defaultStartPin = useSelector((state: AppState) => state.audio.startPin);
  const [startPin, setStartPin] = useState(defaultStartPin + "");
  const audioDispatch = useDispatch<Dispatch<AudioActions>>();
  const { sampleSets, code } = useSelector((state: AppState) => state.audio);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLoadFromUrl = async () => {
    setLoading(true);
    const samples = await visualizeAudioFromUrl(url, maxSamples);
    if (samples) {
      audioDispatch({ type: "LOAD_SAMPLES", samples });
    }
    setLoading(false);
  };

  const handleDelete = (id: string) => () => {
    audioDispatch({ type: "DELETE_SAMPLES", id });
  }

  const handleLoadFromFile = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile = async (event: {target: HTMLInputElement}) => {
    setLoading(true);
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const buffer = await files[i].arrayBuffer();
        const samples = await visualizeAudioFromFile(buffer, maxSamples);
        if (samples) {
          audioDispatch({ type: "LOAD_SAMPLES", samples });
        }
      }
    }
    setLoading(false);
  }

  const saveStartPin = () => {
    const startPinNum = parseInt(startPin);
    if (isFinite(startPinNum) && startPinNum >= 0 && startPinNum < 256) {
      audioDispatch({type: "CHANGE_START_PIN", startPin: startPinNum })
    }
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoadFromUrl}
          >
            Load from URL
          </Button>
        </Grid>
        <Grid item xs={10}>
          <TextField
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoadFromFile}
          >
            Load from file
          </Button>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleChangeFile}
          />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={3}>
          <CopyToClipboard text={code}>
            <button>Copy code to clipboard</button>
          </CopyToClipboard>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Start Pin"
            value={startPin}
            onChange={(e) => setStartPin(e.target.value)}
            onBlur={saveStartPin}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveStartPin();
              }
            }}
          />
        </Grid>
        <Grid item xs={1}>
          {loading ? <CircularProgress /> : ""}
        </Grid>
        {sampleSets.map((sampleSet) => (
          <Fragment key={sampleSet.id}>
            <Grid item xs={11}>
              <BarChart samples={sampleSet.samples} />
            </Grid>
            <Grid item xs={1} style={{ alignItems: "center", display: "flex" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDelete(sampleSet.id)}
              >
                <Icons.Delete />
              </Button>
            </Grid>
          </Fragment>
        ))}
        <Grid item xs={12}>
          <pre>{code}</pre>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
