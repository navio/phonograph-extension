import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import React, { useState, useEffect } from "react";
import {
  messageBackgroundAction,
  initializeOptions,
  listenerLibraryUpdate,
} from "../background/actions";
import { InitializeOptionsResponse } from "./types";

import App from "ui/app";
import { IEpisode } from "podcastsuite/dist/Format";
import { endEmissionListener, pauseEmissionListener, playingEmissionListener } from "player/actions";
import { AudioState } from "player/types";


export default () => {
  const [collection, setCollection] = useState<IPodcast[]>([]);
  const [episode, setEpisode] = useState<IEpisode>();
  const [playerState, setPlayerState] = useState<AudioState>();

  useEffect(() => {
    messageBackgroundAction(
      initializeOptions("Init Whole APP"),
      (response: InitializeOptionsResponse) => {
        const { library, episode, state } = response.payload;
        setCollection(library);
        setPlayerState(state);
        setEpisode(episode);
      }
    );

    listenerLibraryUpdate((library) => setCollection(library));
    
    endEmissionListener((message) => {
      const { state } = message.payload;
      setPlayerState(state);
    })

    playingEmissionListener((message) => {
      const { media, state } = message.payload;
      setPlayerState(state);
      setEpisode(media);
    });

    pauseEmissionListener((message) => {
      const { state } = message.payload;
      setPlayerState(state);
    })
  }, []);

  return <App collection={collection} episode={episode} audioState={playerState} />;
};
