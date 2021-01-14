import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import React, { useState, useEffect } from "react";
import {
  messageBackgroundAction,
  initializeOptions,
} from "../background/actions";
import { InitializeOptionsResponse } from "./types";

const App = () => {
  const [message, setMessage] = useState("");
  const [library, setLibrary] = useState<IPodcast[]>([]);
  useEffect(() => {
    messageBackgroundAction(initializeOptions("hello"), (response: InitializeOptionsResponse) => {
      const { library } = response.payload;
      setLibrary(library);
      setMessage('Initialized!');
    });
  }, []);

  return <div>{message}
    <ul>{library.map( (podcast: IPodcast) => <li>{podcast.title} <br /> {podcast.summary}</li>  )}</ul>
  </div>;
};

export default App;
