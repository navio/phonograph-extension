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
  playing?: boolean;
}>({
  collection: []
});

export interface IAppProps {
  collection: IPodcast[];
  episode: IEpisode;
  playerState: AudioState;
}

export default function App(props: IAppProps) {
  const { collection, episode, playerState } = props;
  const playing = playerState ? playerState.playing : false;
  return (
    <AppContext.Provider value={{ collection, episode, playing }}>
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
