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
    chrome.runtime.onMessage.addListener((message) => console.log('popup',message))
  }, []);

  const loadAudio = () => {};
    // messagePlayerAction(
    //   Triggers.load(
    //     "https://dcs.megaphone.fm/CAD1225141363.mp3?key=91bb59c2c82f5120e3d7759adc50159c"
    //   ),
    //   (response) => {
    //     console.log(response);
    //   }
    // );


  const pauseAudio = () => messagePlayerAction(
    Triggers.stop(),
    (response) => {
      console.log(response);
    }
  );

  return <div>Hello, {message}
  <button onClick={() => loadAudio()}> Play </button>
  <button onClick={() => pauseAudio()}> Stop </button>
  </div>;
};

export default App;
