import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import React, { useState, useEffect } from "react";
import {
  messageBackgroundAction,
  initializeOptions,
} from "../background/actions";
import { InitializeOptionsResponse } from "./types";

import App from "ui/app";
import { IEpisode } from "podcastsuite/dist/Format";
import { pauseEmissionListener, playingEmissionListener } from "player/actions";
import { AudioState } from "player/types";


export default () => {
  const [collection, setCollection] = useState<IPodcast[]>([]);
  const [episode, setEpisode] = useState<IEpisode>();
  const [playerState, setPlayerState] = useState<AudioState>();

  useEffect(() => {
    messageBackgroundAction(
      initializeOptions("Init Whole APP"),
      (response: InitializeOptionsResponse) => {
        const { library, episode } = response.payload;
        setCollection(library);
        setEpisode(episode);
      }
    );

    playingEmissionListener((message) => {
      const { media, state } = message.payload;
      setPlayerState(state);
      setEpisode(media);
    });
    
    pauseEmissionListener((message) => {
      console.log('Options App', message, Date.now());
      const { state } = message.payload;
      setPlayerState(state);
    })
  }, []);

  return <App collection={collection} episode={episode} playerState={playerState} />;
};
