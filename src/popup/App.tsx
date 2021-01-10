import React, { useState, useEffect } from "react";
import { messageBackgroundAction, initializePopUp } from "background/actions";
import { messagePlayerAction, Triggers } from "player/actions";
import { InitializePopUpResponse } from "./types";

const App = () => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    messageBackgroundAction(
      initializePopUp("hello"),
      (response: InitializePopUpResponse) => {
        const { id } = response.payload;
        setMessage(id);
      }
    );
  }, []);

  const loadAudio = () =>
    messagePlayerAction(
      Triggers.load(
        "https://dcs.megaphone.fm/CAD1225141363.mp3?key=91bb59c2c82f5120e3d7759adc50159c"
      ),
      () => {
        console.log("sent");
      }
    );

  return <div>Hello, {message}<button onClick={() => loadAudio()}> Play </button></div>;
};

export default App;
