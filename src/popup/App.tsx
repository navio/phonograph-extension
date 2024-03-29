import React, { useState, useEffect } from "react";
import { messageBackgroundAction, initializePopUp } from "background/actions";
import { endEmissionListener, messagePlayerAction, pauseEmissionListener, playingEmissionListener, Triggers } from "player/actions";
import { InitializePopUpResponse } from "./types";
import { IEpisode } from "podcastsuite/dist/Format";
import { AudioState } from "player/types";
import PopUp from 'ui/mini';
import { ISimplePodcast } from "src/Podcast";
import { PodcastImage } from "ui/utils/imageSaver";

const App = () => {
  const [episode, setEpisode] = useState<IEpisode>();
  const [playerState, setPlayerState] = useState<AudioState>();
  const [podcast, setPodcast] = useState<ISimplePodcast>();
  const [media, setMedia] = useState<PodcastImage>();
  useEffect(() => {
    messageBackgroundAction(
      initializePopUp(),
      (response: InitializePopUpResponse) => {
        const { episode, state, podcast, podcastImage } = response.payload;
        setEpisode(episode);
        setPlayerState(state);
        setPodcast(podcast);
        setMedia(podcastImage);
      }
    );
  }, []);

  endEmissionListener((message) => {
    const { state } = message.payload;
    setPlayerState(state);
    return true
  })

  playingEmissionListener((message) => {
    const { media, state } = message.payload;
    console.log(state);
    setPlayerState(state);
    setEpisode(media);
    return true;
  });

  pauseEmissionListener((message) => {
    const { state, media } = message.payload;
    console.log(state);
    setPlayerState(state);
    setEpisode(media);
    return true;
  })

  return <PopUp episode={episode} audioState={playerState} podcast={podcast} media={media} /> ;
};

export default App;

