import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import React, { useState, useEffect } from "react";
import {
  messageBackgroundAction,
  initializeOptions,
} from "../background/actions";
import { InitializeOptionsResponse } from "./types";

import App from "ui/app";
import { IEpisode } from "podcastsuite/dist/Format";
import { playingEmissionListener } from "player/actions";
import { PLAYER_EMITIONS } from "player/types";

export default () => {
  const [collection, setCollection] = useState<IPodcast[]>([]);
  const [episode, setEpisode] = useState<IEpisode>();

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
      const { media } = message.payload;
      setEpisode(media);
    });
  }, []);

  return <App collection={collection} episode={episode} />;
};
