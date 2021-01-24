import React, { useEffect, useState } from "react";
import { IPodcast as IPodcastSuitePodcast } from "podcastsuite/dist/PodcastSuite";
import Header from "./Header";
import Library from "./Library";
import Podcast from "./Podcast";

import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { IEpisode } from "podcastsuite/dist/Format";
import { AudioState } from "player/audio";

export type IPodcast = IPodcastSuitePodcast;

export const AppContext = React.createContext<{
  collection: IPodcast[];
  episode?: IEpisode;
  audioState?: AudioState;
}>({
  collection: []
});

export interface IAppProps {
  collection: IPodcast[];
  episode: IEpisode;
  audioState: AudioState;
}

export default function App(props: IAppProps) {
  const { collection, episode, audioState } = props;
  return (
    <AppContext.Provider value={{ collection, episode, audioState }}>
      <Router>
        <Switch>
          <Route path="/podcast/:podcast">
            <Podcast />
          </Route>
          <Route path="/">
            <Header />
            <Library />
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}
