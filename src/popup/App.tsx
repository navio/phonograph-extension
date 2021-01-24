import React, { useState, useEffect } from "react";
import { messageBackgroundAction, initializePopUp } from "background/actions";
import { messagePlayerAction, Triggers } from "player/actions";
import { InitializePopUpResponse } from "./types";
import { IEpisode } from "podcastsuite/dist/Format";

const App = () => {
  const [message, setMessage] = useState("");
  const [episode, setEpisode] = useState<IEpisode>();
  useEffect(() => {
    messageBackgroundAction(
      initializePopUp(),
      (response: InitializePopUpResponse) => {
        const { episode } = response.payload;
        setMessage(episode.title);
        setEpisode(episode);
      }
    );
    chrome.runtime.onMessage.addListener((message) =>
      console.log("popup", message)
    );
  }, []);

  const loadAudio = () => {};
  messagePlayerAction(Triggers.load(episode), (response) => {
    console.log(response);
  });

  const pauseAudio = () =>
    messagePlayerAction(Triggers.stop(), (response) => {
      console.log(response);
    });

  return (
    <div>
      Hello, {message}
      <button onClick={() => loadAudio()}> Play </button>
      <button onClick={() => pauseAudio()}> Stop </button>
    </div>
  );
};

export default App;
