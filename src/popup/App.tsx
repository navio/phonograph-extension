import React, { useState, useEffect } from "react";
import { messageBackgroundAction, initializePopUp } from "background/actions";
import { messagePlayerAction, pauseEmissionListener, playingEmissionListener, Triggers } from "player/actions";
import { InitializePopUpResponse } from "./types";
import { IEpisode } from "podcastsuite/dist/Format";
import { AudioState } from "player/types";
import PopUp from 'ui/mini';

const App = () => {
  const [episode, setEpisode] = useState<IEpisode>();
  const [playerState, setPlayerState] = useState<AudioState>();
  useEffect(() => {
    messageBackgroundAction(
      initializePopUp(),
      (response: InitializePopUpResponse) => {
        const { episode, state } = response.payload;
        setEpisode(episode);
        setPlayerState(state);
        console.log(state);
      }
    );
  }, []);

  playingEmissionListener((message) => {
    const { media, state } = message.payload;
    setPlayerState(state);
    setEpisode(media);
  });

  pauseEmissionListener((message) => {
    const { state, media } = message.payload;
    setPlayerState(state);
    setEpisode(media);

  })

  return <PopUp episode={episode} audioState={playerState} /> ;
};

export default App;
