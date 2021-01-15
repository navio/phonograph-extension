import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import React, { useState, useEffect } from "react";
import {
  messageBackgroundAction,
  initializeOptions,
} from "../background/actions";
import { InitializeOptionsResponse } from "./types";

import App from "ui/app";

export default () => {
  const [collection, setCollection] = useState<IPodcast[]>([]);
  
  useEffect(() => {
    messageBackgroundAction(
      initializeOptions("hello"),
      (response: InitializeOptionsResponse) => {
        const { library } = response.payload;
        setCollection(library);
      }
    );
  }, []);

  return <App collection={collection} />;
};
